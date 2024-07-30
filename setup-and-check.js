const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
const mongoose = require('mongoose');

const rootDir = path.resolve(__dirname);
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

function runCommand(command, directory) {
  try {
    execSync(command, { cwd: directory, stdio: 'inherit' });
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${command}`);
    console.error(error);
  }
}

function checkEnvFile() {
  const envPath = path.join(backendDir, '.env');
  if (!fs.existsSync(envPath)) {
    console.log("Fichier .env non trouvé. Création d'un nouveau fichier .env...");
    const envContent = `
DB_HOST=localhost
DB_PORT=27017
DB_NAME=boulangerie
DB_USER=your_username
DB_PASSWORD=your_password
API_KEY=your_api_key
PORT=50687
    `.trim();
    fs.writeFileSync(envPath, envContent);
    console.log("Fichier .env créé. Veuillez le modifier avec vos informations réelles.");
  } else {
    console.log("Fichier .env trouvé.");
  }
}

function checkBackendConfig() {
  const serverJsPath = path.join(backendDir, 'server.js');
  const serverContent = fs.readFileSync(serverJsPath, 'utf8');
  if (!serverContent.includes("require('dotenv').config()")) {
    console.log("Ajout de la configuration dotenv dans server.js...");
    const updatedContent = "require('dotenv').config();\n" + serverContent;
    fs.writeFileSync(serverJsPath, updatedContent);
  }
  console.log("Configuration du backend vérifiée.");
}

function checkFrontendProxy() {
  const packageJsonPath = path.join(frontendDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.proxy !== "http://localhost:50687") {
    console.log("Mise à jour du proxy dans package.json du frontend...");
    packageJson.proxy = "http://localhost:50687";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  console.log("Configuration du proxy frontend vérifiée.");
}

async function testDatabaseConnection() {
  require('dotenv').config({ path: path.join(backendDir, '.env') });
  try {
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à la base de données réussie.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error.message);
  }
}

async function testBackendConnection() {
  try {
    const response = await axios.get('http://localhost:50687/products');
    console.log("Connexion au backend réussie. Réponse:", response.data);
  } catch (error) {
    console.error("Erreur de connexion au backend:", error.message);
  }
}

// ... (le reste du code reste inchangé)

async function testDatabaseConnection() {
    require('dotenv').config({ path: path.join(backendDir, '.env') });
    try {
      console.log(`Tentative de connexion à mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
      await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connexion à la base de données réussie.");
      await mongoose.disconnect();
    } catch (error) {
      console.error("Erreur de connexion à la base de données:", error.message);
      throw error; // Propager l'erreur pour arrêter le script
    }
  }
  
  async function main() {
    try {
      console.log("Début de la configuration et de la vérification...");
  
      checkEnvFile();
      checkBackendConfig();
      checkFrontendProxy();
  
      console.log("Installation des dépendances du backend...");
      runCommand('npm install', backendDir);
  
      console.log("Installation des dépendances du frontend...");
      runCommand('npm install', frontendDir);
  
      await testDatabaseConnection();
  
      console.log("Démarrage du backend...");
      runCommand('npm start', backendDir);
  
      console.log("Attente du démarrage du backend...");
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      await testBackendConnection();
  
      console.log("Configuration et vérification terminées avec succès.");
    } catch (error) {
      console.error("Une erreur est survenue pendant la configuration :", error);
    }
  }
  
  main().catch(console.error);