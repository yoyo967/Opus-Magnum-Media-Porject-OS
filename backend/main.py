from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uvicorn
import os
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

# Enable CORS for the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-opus-magnum-key-for-local-dev")
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

@app.get("/health")
def health_check():
    return {"status": "operational", "system": "OPUS MAGNUM AI"}

@app.get("/api/tenant/shared-key")
def get_shared_key(email: str = Depends(get_current_user_email)):
    shared_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("MIRROU_GEMINI_KEY")
    if not shared_key:
        raise HTTPException(status_code=404, detail="Shared Gemini API Key not configured on this environment")
    return {"geminiApiKey": shared_key}

@app.post("/api/lead")
def create_lead(request: LeadRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    # 1. Honeypot check
    if request.company_website and request.company_website.strip() != "":
        # Silently absorb spam (fail-safe/spam-sink)
        print("Honeypot triggered! Spam lead ignored.")
        return {"status": "success", "message": "Lead submitted successfully (spam-sink)"}
        
    # 2. Validation
    if not request.name.strip() or not request.email.strip() or not request.message.strip():
        raise HTTPException(status_code=400, detail="Name, Email, and Message are required fields")
        
    if not request.consent:
        raise HTTPException(status_code=400, detail="Privacy policy consent is required")
        
    # 3. Write to Firestore tenants/mirrou/leads/
    try:
        leads_ref = db.collection('tenants').document('mirrou').collection('leads')
        lead_data = {
            "name": request.name.strip(),
            "email": request.email.lower().strip(),
            "brand": request.brand.strip() if request.brand else "",
            "website": request.website.strip() if request.website else "",
            "ad_spend": request.ad_spend,
            "message": request.message.strip(),
            "consent": request.consent,
            "created_at": firestore.SERVER_TIMESTAMP,
            "status": "new"
        }
        leads_ref.add(lead_data)
        return {"status": "success", "message": "Lead submitted successfully"}
    except Exception as e:
        print("Error saving lead to Firestore:", e)
        raise HTTPException(status_code=500, detail="Failed to save lead database entry")

@app.post("/api/auth/login")
def login(request: AuthRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    users_ref = db.collection('tenants')
    query = users_ref.where(filter=firestore.FieldFilter('email', '==', request.email.lower())).limit(1).stream()
    
    user_doc = None
    for doc in query:
        user_doc = doc
        break
        
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user_data = user_doc.to_dict()
    if not verify_password(request.password, user_data['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token(data={"sub": request.email.lower(), "role": "operator"})
    
    # Ensure tenant membership document exists (backward compatibility)
    tenant_id = user_doc.id
    try:
        member_ref = db.collection('tenants').document(tenant_id).collection('members').document(tenant_id)
        if not member_ref.get().exists:
            member_ref.set({
                "email": request.email.lower(),
                "role": "Owner",
                "joined_at": firestore.SERVER_TIMESTAMP,
                "permissions": ["all"]
            })
    except Exception as e:
        print("Warning: Failed to ensure tenant membership:", e)
        
    return {"token": access_token, "tenant_id": tenant_id, "email": request.email.lower(), "firebaseToken": mint_firebase_token(tenant_id)}

@app.post("/api/auth/register")
def register(request: AuthRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    users_ref = db.collection('tenants')
    query = users_ref.where(filter=firestore.FieldFilter('email', '==', request.email.lower())).limit(1).stream()
    
    for doc in query:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(request.password)
    tenant_data = {
        "email": request.email.lower(),
        "hashed_password": hashed_password,
        "created_at": firestore.SERVER_TIMESTAMP,
        "role": "Operator"
    }
    
    update_time, tenant_ref = users_ref.add(tenant_data)
    tenant_id = tenant_ref.id
    
    # Create tenant membership document
    try:
        member_ref = db.collection('tenants').document(tenant_id).collection('members').document(tenant_id)
        member_ref.set({
            "email": request.email.lower(),
            "role": "Owner",
            "joined_at": firestore.SERVER_TIMESTAMP,
            "permissions": ["all"]
        })
    except Exception as e:
        print("Warning: Failed to create tenant membership:", e)
        
    access_token = create_access_token(data={"sub": request.email.lower(), "role": "operator"})
    return {"token": access_token, "tenant_id": tenant_id, "email": request.email.lower(), "status": "tenant created", "firebaseToken": mint_firebase_token(tenant_id)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
