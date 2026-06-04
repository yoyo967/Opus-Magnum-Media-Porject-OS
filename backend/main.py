from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
import os
import re
import secrets
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
# Initialize Firestore Client (will automatically use GCP credentials when on Cloud Run)
from google.cloud import firestore
import firebase_admin
from firebase_admin import auth as fb_auth

app = FastAPI(
    title="OPUS MAGNUM AI",
    description="Tenant & Orchestration API for the Opus Magnum OS",
    version="3.0.0"
)

# --- Rate limiting (slowapi). In-memory, per-instance: Cloud Run may run several
# instances, so this is not a global limit, but it stops single-source abuse
# (spam floods, login brute-force). Key on the real client IP from X-Forwarded-For
# (Cloud Run sets it); fall back to the peer address.
def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return get_remote_address(request)

limiter = Limiter(key_func=_client_ip)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS: restrict to known first-party origins (no more "*").
# Override/extend at deploy time via ALLOWED_ORIGINS (comma-separated env var).
_DEFAULT_ORIGINS = [
    "https://mirrou.studio",
    "https://www.mirrou.studio",
    "https://app.mirrou.studio",
    "https://studio-4188712377-b3681.web.app",
    "https://studio-4188712377-b3681.firebaseapp.com",
    "https://opus-magnum-media-v3-923137317598.europe-west3.run.app",
    "https://opus-magnum-media-v3-iqy7yeycta-ey.a.run.app",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://localhost:5173",
]
_env_origins = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in _env_origins.split(",") if o.strip()] or _DEFAULT_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Database
try:
    db = firestore.Client(project="studio-4188712377-b3681", database="opus-eu")
except Exception as e:
    # Fallback if no local credentials, useful for local testing without key
    print("Warning: Firestore client could not be initialized (No credentials found).", e)
    db = None

# Firebase Admin: praegt Custom Tokens fuer die Client-Firebase (studio-4188712377-b3681),
# damit der Client per signInWithCustomToken request.auth fuer Firestore-Rules erhaelt.
# Cross-project: benoetigt zur Laufzeit IAM-Foederation (runtime-SA mit
# roles/iam.serviceAccountTokenCreator auf der Ziel-firebase-adminsdk-SA).
FIREBASE_PROJECT = os.environ.get("FIREBASE_PROJECT_ID", "studio-4188712377-b3681")
try:
    firebase_admin.initialize_app(options={"projectId": FIREBASE_PROJECT})
except Exception as e:
    print("Warning: firebase-admin could not be initialized:", e)

# Security
# JWT signing key. MUST be injected at runtime (Secret Manager -> JWT_SECRET).
# There is deliberately NO hardcoded fallback: a known key in git would let anyone
# forge tokens and call /api/tenant/shared-key to exfiltrate the Gemini key.
SECRET_KEY = os.environ.get("JWT_SECRET")
if not SECRET_KEY:
    # Cloud Run / Knative set K_SERVICE. In any managed runtime we fail closed
    # rather than start with an insecure default.
    if os.environ.get("K_SERVICE"):
        raise RuntimeError(
            "JWT_SECRET is not set. Refusing to start in a managed runtime without a "
            "signing key. Provision it via Secret Manager (see deploy_backend_gcp.ps1)."
        )
    # Local dev only: ephemeral per-process key (never a constant committed to git).
    SECRET_KEY = "local-dev-" + secrets.token_urlsafe(32)
    print("Warning: JWT_SECRET not set -> using an ephemeral local-dev key "
          "(tokens are invalidated on restart). Set JWT_SECRET for stable local auth.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Bearer Token Auth Helper
security = HTTPBearer()

def get_current_user_email(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authorization token")

def mint_firebase_token(uid: str):
    """Best-effort Firebase Custom Token fuer den Client (signInWithCustomToken).
    Faellt sanft auf None zurueck, wenn IAM/Setup fehlt -> Client nutzt dann localStorage."""
    try:
        return fb_auth.create_custom_token(uid).decode("utf-8")
    except Exception as e:
        print("Warning: Firebase custom token minting failed:", e)
        return None

# --- Multi-Tenant: Team-Allowlist -> geteilter Mirrou-Tenant -------------------
# Bekannte Team-Mails teilen sich EINEN Workspace (tenants/mirrou); alle anderen
# bekommen einen eigenen Tenant. uid ist immer pro Person (private Daten unter
# users/{uid}); tenant_id ist der (ggf. geteilte) Workspace.
MIRROU_TENANT_ID = "mirrou"
_DEFAULT_TEAM = (
    "denys.demyanyshyn@dci-student.org,info.ralphkindermann@gmail.com,"
    "olhayevtushenko57@gmail.com,yildirimyahya716@gmail.com"
)
TEAM_EMAILS = {e.strip().lower() for e in os.environ.get("MIRROU_TEAM_EMAILS", _DEFAULT_TEAM).split(",") if e.strip()}

def _uid_for(email: str) -> str:
    """Stabile, pro-Person eindeutige uid aus der E-Mail (Firestore/Firebase)."""
    return re.sub(r'[^a-z0-9]', '_', email.strip().lower())

def _tenant_for(email: str) -> str:
    """Team-Mails -> geteilter 'mirrou'-Tenant; sonst eigener Tenant (= uid)."""
    e = email.strip().lower()
    return MIRROU_TENANT_ID if e in TEAM_EMAILS else _uid_for(e)

def _ensure_tenant_and_membership(tenant_id: str, uid: str, email: str):
    """Tenant-Doc + Mitgliedschaft (members/{uid}) idempotent serverseitig anlegen.
    firestore.rules verlangen members/{request.auth.uid} fuer Tenant-Zugriff."""
    tenant_ref = db.collection('tenants').document(tenant_id)
    if not tenant_ref.get().exists:
        tenant_ref.set({"created_at": firestore.SERVER_TIMESTAMP, "label": tenant_id})
    member_ref = tenant_ref.collection('members').document(uid)
    if not member_ref.get().exists:
        member_ref.set({
            "email": email,
            "role": "Owner",
            "joined_at": firestore.SERVER_TIMESTAMP,
            "permissions": ["all"],
        })

def require_mirrou_member(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Wie get_current_user_email, verlangt aber zusaetzlich tenant_id == 'mirrou'
    (aus dem signierten JWT) → schuetzt die Lead-Endpunkte auf das Mirrou-Team."""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authorization token")
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token credentials")
    if payload.get("tenant_id") != MIRROU_TENANT_ID:
        raise HTTPException(status_code=403, detail="Forbidden: Mirrou team access only")
    return email

class AuthRequest(BaseModel):
    email: str
    password: str

class LeadRequest(BaseModel):
    name: str
    email: str
    brand: str
    website: str | None = None
    ad_spend: str | None = None
    message: str
    consent: bool
    company_website: str | None = None # Honeypot

class LeadStatusUpdate(BaseModel):
    status: str

# Lead-Pipeline-Stufen (Lead-Inbox v2)
ALLOWED_LEAD_STATUSES = {"new", "contacted", "qualified", "won", "lost", "archived"}

@app.get("/health")
def health_check():
    return {"status": "operational", "system": "OPUS MAGNUM AI"}

@app.get("/api/tenant/shared-key")
def get_shared_key(email: str = Depends(require_mirrou_member)):
    shared_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("MIRROU_GEMINI_KEY")
    if not shared_key:
        raise HTTPException(status_code=404, detail="Shared Gemini API Key not configured on this environment")
    return {"geminiApiKey": shared_key}

@app.get("/api/leads")
@limiter.limit("30/minute")
def list_leads(request: Request, email: str = Depends(require_mirrou_member)):
    """Lead-Inbox: liefert die Website-Leads aus tenants/mirrou/leads (Admin SDK,
    umgeht die firestore.rules). JWT-geschuetzt.
    NOTE: aktuell darf jeder authentifizierte Cockpit-User Mirrous Leads lesen
    (Mirrou = Tenant #1, intern). Beim Multi-Tenant-SaaS-Start auf
    mirrou-Tenant-Mitglieder / Admin-Rolle einschraenken."""
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
    try:
        leads_ref = (
            db.collection('tenants').document('mirrou').collection('leads')
            .order_by('created_at', direction=firestore.Query.DESCENDING)
            .limit(200)
        )
        out = []
        for doc in leads_ref.stream():
            d = doc.to_dict()
            created = d.get('created_at')
            out.append({
                "id": doc.id,
                "name": d.get('name', ''),
                "email": d.get('email', ''),
                "brand": d.get('brand', ''),
                "website": d.get('website', ''),
                "ad_spend": d.get('ad_spend'),
                "message": d.get('message', ''),
                "consent": d.get('consent', False),
                "status": d.get('status', 'new'),
                "created_at": created.isoformat() if hasattr(created, 'isoformat') else None,
            })
        return {"leads": out, "count": len(out)}
    except Exception as e:
        print("Error reading leads:", e)
        raise HTTPException(status_code=500, detail="Failed to read leads")

@app.patch("/api/leads/{lead_id}")
@limiter.limit("60/minute")
def update_lead_status(request: Request, lead_id: str, body: LeadStatusUpdate, email: str = Depends(require_mirrou_member)):
    """Lead-Inbox v2: setzt den Pipeline-Status eines Leads. JWT-geschuetzt, Admin SDK."""
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
    if body.status not in ALLOWED_LEAD_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {sorted(ALLOWED_LEAD_STATUSES)}")
    try:
        ref = db.collection('tenants').document('mirrou').collection('leads').document(lead_id)
        if not ref.get().exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        ref.update({
            "status": body.status,
            "updated_at": firestore.SERVER_TIMESTAMP,
            "updated_by": email,
        })
        return {"status": "success", "id": lead_id, "new_status": body.status}
    except HTTPException:
        raise
    except Exception as e:
        print("Error updating lead status:", e)
        raise HTTPException(status_code=500, detail="Failed to update lead status")

@app.post("/api/lead")
@limiter.limit("10/minute")
def create_lead(request: Request, lead: LeadRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")

    # 1. Honeypot check
    if lead.company_website and lead.company_website.strip() != "":
        # Silently absorb spam (fail-safe/spam-sink)
        print("Honeypot triggered! Spam lead ignored.")
        return {"status": "success", "message": "Lead submitted successfully (spam-sink)"}

    # 2. Validation
    if not lead.name.strip() or not lead.email.strip() or not lead.message.strip():
        raise HTTPException(status_code=400, detail="Name, Email, and Message are required fields")

    if not lead.consent:
        raise HTTPException(status_code=400, detail="Privacy policy consent is required")

    # 3. Write to Firestore tenants/mirrou/leads/
    try:
        leads_ref = db.collection('tenants').document('mirrou').collection('leads')
        lead_data = {
            "name": lead.name.strip(),
            "email": lead.email.lower().strip(),
            "brand": lead.brand.strip() if lead.brand else "",
            "website": lead.website.strip() if lead.website else "",
            "ad_spend": lead.ad_spend,
            "message": lead.message.strip(),
            "consent": lead.consent,
            "created_at": firestore.SERVER_TIMESTAMP,
            "status": "new"
        }
        leads_ref.add(lead_data)
        return {"status": "success", "message": "Lead submitted successfully"}
    except Exception as e:
        print("Error saving lead to Firestore:", e)
        raise HTTPException(status_code=500, detail="Failed to save lead database entry")

@app.post("/api/auth/login")
@limiter.limit("10/minute")
def login(request: Request, auth: AuthRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")

    email = auth.email.strip().lower()
    uid = _uid_for(email)
    acct = db.collection('accounts').document(uid).get()
    if not acct.exists:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    data = acct.to_dict()
    if not verify_password(auth.password, data.get('hashed_password', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    tenant_id = data.get('tenant_id') or _tenant_for(email)
    try:
        _ensure_tenant_and_membership(tenant_id, uid, email)  # self-heal / Abwaertskompat.
    except Exception as e:
        print("Warning: tenant/membership ensure failed:", e)

    access_token = create_access_token(data={"sub": email, "uid": uid, "tenant_id": tenant_id, "role": "operator"})
    return {"token": access_token, "uid": uid, "tenant_id": tenant_id, "email": email, "firebaseToken": mint_firebase_token(uid)}

@app.post("/api/auth/register")
@limiter.limit("5/minute")
def register(request: Request, auth: AuthRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")

    email = auth.email.strip().lower()
    # Registrierung ist INVITE-ONLY: nur Mails aus der Allowlist (MIRROU_TEAM_EMAILS).
    # Verhindert, dass Fremde Accounts anlegen und den geteilten Gemini-Key abgreifen.
    if email not in TEAM_EMAILS:
        raise HTTPException(status_code=403, detail="Registration is invite-only.")
    uid = _uid_for(email)
    acct_ref = db.collection('accounts').document(uid)
    if acct_ref.get().exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    tenant_id = _tenant_for(email)  # Team-Mail -> 'mirrou' (geteilt), sonst eigener Tenant
    acct_ref.set({
        "email": email,
        "hashed_password": get_password_hash(auth.password),
        "tenant_id": tenant_id,
        "created_at": firestore.SERVER_TIMESTAMP,
        "role": "operator",
    })
    try:
        _ensure_tenant_and_membership(tenant_id, uid, email)
    except Exception as e:
        print("Warning: tenant/membership setup failed:", e)

    access_token = create_access_token(data={"sub": email, "uid": uid, "tenant_id": tenant_id, "role": "operator"})
    return {"token": access_token, "uid": uid, "tenant_id": tenant_id, "email": email, "status": "account created", "firebaseToken": mint_firebase_token(uid)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
