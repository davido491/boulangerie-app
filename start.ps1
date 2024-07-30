# start.ps1

# Définir les chemins des dossiers backend et frontend
$backendPath = "C:\Users\sebas\boulangerie-app\backend"
$frontendPath = "C:\Users\sebas\boulangerie-app\frontend"

# Fonction pour afficher les messages
function Write-ColoredMessage($message, $color) {
    Write-Host $message -ForegroundColor $color
}

# Démarrer le backend
Write-ColoredMessage "Démarrage du backend..." Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start"

# Attendre quelques secondes pour que le backend démarre
Start-Sleep -Seconds 5

# Démarrer le frontend
Write-ColoredMessage "Démarrage du frontend..." Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"

Write-ColoredMessage "Application démarrée !" Green
Write-ColoredMessage "Pour arrêter l'application, fermez les fenêtres PowerShell ouvertes." Yellow