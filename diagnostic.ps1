# Configurer l'encodage UTF-8 dans PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Configuration initiale
$projectRoot = "C:\Users\sebas\boulangerie-app"
$backendFolder = Join-Path $projectRoot "backend"
$frontendFolder = Join-Path $projectRoot "frontend"

# Fonction pour afficher les messages
function Write-StatusMessage {
    param (
        [string]$message,
        [string]$type = "Info"
    )
    switch ($type) {
        "Info" { Write-Host $message -ForegroundColor Cyan }
        "Success" { Write-Host $message -ForegroundColor Green }
        "Warning" { Write-Host $message -ForegroundColor Yellow }
        "Error" { Write-Host $message -ForegroundColor Red }
    }
}

# Diagnostic du serveur Node.js
function Diagnose-NodeServer {
    Write-StatusMessage "Diagnostic du serveur Node.js..." "Info"
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($process in $nodeProcesses) {
            Write-StatusMessage "Processus Node.js trouvé (PID: $($process.Id))" "Info"
            $connections = Get-NetTCPConnection | Where-Object { $_.OwningProcess -eq $process.Id -and $_.State -eq 'Listen' }
            if ($connections) {
                foreach ($connection in $connections) {
                    Write-StatusMessage "Port d'écoute trouvé: $($connection.LocalPort)" "Success"
                }
            } else {
                Write-StatusMessage "Aucun port d'écoute trouvé pour le processus $($process.Id)" "Warning"
                Write-StatusMessage "Vérifiez la configuration du serveur dans le fichier principal (par exemple, server.js ou app.js)" "Info"
            }
        }
    } else {
        Write-StatusMessage "Aucun processus Node.js en cours d'exécution" "Error"
    }
}

# Diagnostic des logs du serveur
function Diagnose-ServerLogs {
    Write-StatusMessage "Diagnostic des logs du serveur..." "Info"
    $possibleLogPaths = @(
        (Join-Path $backendFolder "logs\server.log"),
        (Join-Path $backendFolder "server.log"),
        (Join-Path $projectRoot "logs\server.log")
    )
    
    $logFound = $false
    foreach ($logPath in $possibleLogPaths) {
        if (Test-Path $logPath) {
            Write-StatusMessage "Fichier de log trouvé: $logPath" "Success"
            $logs = Get-Content $logPath -Tail 20
            Write-StatusMessage "Dernières lignes de log:"
            $logs | ForEach-Object { Write-StatusMessage $_ "Info" }
            $logFound = $true
            break
        }
    }
    
    if (-not $logFound) {
        Write-StatusMessage "Aucun fichier de log trouvé" "Warning"
        Write-StatusMessage "Vérifiez la configuration de journalisation dans votre application" "Info"
    }
}

# Diagnostic des problèmes d'accès aux fichiers
function Diagnose-FileAccess {
    Write-StatusMessage "Diagnostic des problèmes d'accès aux fichiers..." "Info"
    $problematicFile = Join-Path $backendFolder "node_modules\ipaddr.js\ipaddr.js"
    if (Test-Path $problematicFile) {
        try {
            $null = Get-Content $problematicFile -ErrorAction Stop
            Write-StatusMessage "Accès au fichier ipaddr.js réussi" "Success"
        } catch {
            Write-StatusMessage "Erreur d'accès au fichier ipaddr.js: $($_.Exception.Message)" "Error"
            Write-StatusMessage "Vérifiez les permissions du dossier node_modules et de ses sous-dossiers" "Info"
        }
    } else {
        Write-StatusMessage "Le fichier ipaddr.js n'existe pas" "Warning"
        Write-StatusMessage "Essayez de réinstaller les dépendances avec 'npm install'" "Info"
    }
}

# Diagnostic du build frontend
function Diagnose-FrontendBuild {
    Write-StatusMessage "Diagnostic du build frontend..." "Info"
    Set-Location $frontendFolder
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.dependencies.dotenv -or $packageJson.devDependencies.dotenv) {
        Write-StatusMessage "Le package 'dotenv' est présent" "Success"
    } else {
        Write-StatusMessage "Le package 'dotenv' n'est pas trouvé" "Warning"
    }

    Write-StatusMessage "Exécution de la commande de build..." "Info"
    try {
        npm run build
        Write-StatusMessage "Build frontend réussi" "Success"
    } catch {
        Write-StatusMessage "Erreur lors du build frontend: $($_.Exception.Message)" "Error"
    }
}

# Exécuter les tests unitaires
function Run-UnitTests {
    Write-StatusMessage "Exécution des tests unitaires..." "Info"
    Set-Location $projectRoot
    try {
        npm test
        Write-StatusMessage "Tests unitaires réussis" "Success"
    } catch {
        Write-StatusMessage "Erreur lors des tests unitaires: $($_.Exception.Message)" "Error"
    }
}

# Exécuter les tests de bout en bout
function Run-EndToEndTests {
    Write-StatusMessage "Exécution des tests de bout en bout..." "Info"
    Set-Location $projectRoot
    try {
        npm run e2e
        Write-StatusMessage "Tests de bout en bout réussis" "Success"
    } catch {
        Write-StatusMessage "Erreur lors des tests de bout en bout: $($_.Exception.Message)" "Error"
    }
}

# Exécuter les diagnostics et les tests
Diagnose-NodeServer
Diagnose-ServerLogs
Diagnose-FileAccess
Diagnose-FrontendBuild
Run-UnitTests
Run-EndToEndTests

