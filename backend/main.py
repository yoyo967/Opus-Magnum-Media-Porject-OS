from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
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
    db = firestore.Client(project="opus-magnum-ai")
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

@app.get("/health")
def health_check():
    return {"status": "operational", "system": "OPUS MAGNUM AI"}

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
    return {"token": access_token, "tenant_id": user_doc.id, "email": request.email.lower(), "firebaseToken": mint_firebase_token(user_doc.id)}

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
    
    access_token = create_access_token(data={"sub": request.email.lower(), "role": "operator"})
    return {"token": access_token, "tenant_id": tenant_ref.id, "email": request.email.lower(), "status": "tenant created", "firebaseToken": mint_firebase_token(tenant_ref.id)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
