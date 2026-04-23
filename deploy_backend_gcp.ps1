# Deployment Script für GCP Cloud Run (Region: europe-west3) - Backend "OPUS MAGNUM AI"

Write-Host "Starte GCP Cloud Run Deployment für das Backend..." -ForegroundColor Cyan

# Deploye zu Cloud Run: FastAPI Container
# Der Source Code liegt im ./backend Verzeichnis, es verwendet das Dockerfile

gcloud run deploy opus-magnum-ai-backend `
    --source ./backend `
    --region europe-west3 `
    --allow-unauthenticated `
    --project opus-magnum-ai `
    --port 8080

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment des Backends nach europe-west3 erfolgreich abgeschlossen." -ForegroundColor Green
    Write-Host "WICHTIG: Ersetze die VITE_API_URL in der Frontend-.env mit der Cloud Run URL!" -ForegroundColor Yellow
} else {
    Write-Host "Fehler beim Deployment." -ForegroundColor Red
}
