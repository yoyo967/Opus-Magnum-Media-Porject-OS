# Deployment Script für GCP Cloud Run (Region: europe-west3) - Backend "OPUS MAGNUM AI"

Write-Host "Starte GCP Cloud Run Deployment für das Backend..." -ForegroundColor Cyan

# --- EINMALIGE VORAUSSETZUNG: JWT-Signing-Secret in Secret Manager anlegen ---
# Das Backend startet in Cloud Run NICHT ohne JWT_SECRET (fail-closed, kein
# hartcodierter Fallback). Secret einmalig erzeugen + der Runtime-SA Lesezugriff geben:
#
#   $jwt = python -c "import secrets; print(secrets.token_urlsafe(48))"
#   $jwt | gcloud secrets create opus-jwt-secret --project opus-magnum-ai --data-file=-
#   # (Rotation später: ... gcloud secrets versions add opus-jwt-secret --data-file=-)
#   # Runtime-SA Lesezugriff (Default Compute SA, sofern nicht anders gesetzt):
#   #   gcloud secrets add-iam-policy-binding opus-jwt-secret --project opus-magnum-ai `
#   #     --member="serviceAccount:923137317598-compute@developer.gserviceaccount.com" `
#   #     --role="roles/secretmanager.secretAccessor"

# Deploye zu Cloud Run: FastAPI Container
# Der Source Code liegt im ./backend Verzeichnis, es verwendet das Dockerfile

gcloud run deploy opus-magnum-ai-backend `
    --source ./backend `
    --region europe-west3 `
    --allow-unauthenticated `
    --project opus-magnum-ai `
    --port 8080 `
    --set-secrets GEMINI_API_KEY=mirrou-gemini-key:latest,JWT_SECRET=opus-jwt-secret:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment des Backends nach europe-west3 erfolgreich abgeschlossen." -ForegroundColor Green
    Write-Host "WICHTIG: Ersetze die VITE_API_URL in der Frontend-.env mit der Cloud Run URL!" -ForegroundColor Yellow
} else {
    Write-Host "Fehler beim Deployment." -ForegroundColor Red
}
