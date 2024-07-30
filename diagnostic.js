const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

function checkNodeVersion() {
  console.log('Vérification des versions Node.js et npm:');
  console.log(`Node.js version: ${process.version}`);
  console.log(`npm version: ${execSync('npm -v').toString().trim()}`);
}

function checkProxy() {
  console.log('\nVérification de la configuration du proxy:');
  const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`Proxy configuré: ${packageJson.proxy}`);
}

function testBackendConnection() {
  console.log('\nTest de connexion au backend:');
  return new Promise((resolve) => {
    const portFilePath = path.join(__dirname, 'port.txt');
    const backendPort = fs.readFileSync(portFilePath, 'utf8').trim();
    
    const options = {
      hostname: 'localhost',
      port: backendPort,
      path: '/products',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      console.log(`Statut de la réponse: ${res.statusCode}`);
      resolve();
    });

    req.on('error', (e) => {
      console.error(`Erreur de connexion: ${e.message}`);
      resolve();
    });

    req.end();
  });
}

function checkFolderPermissions() {
  console.log('\nVérification des permissions des dossiers:');
  ['frontend', 'backend'].forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    try {
      fs.accessSync(folderPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`${folder}: Lecture/Écriture OK`);
    } catch (err) {
      console.error(`${folder}: Erreur de permission - ${err.message}`);
    }
  });
}

function checkCorsConfig() {
  console.log('\nVérification de la configuration CORS du backend:');
  const serverJsPath = path.join(__dirname, 'backend', 'server.js');
  const serverJs = fs.readFileSync(serverJsPath, 'utf8');
  if (serverJs.includes('app.use(cors())')) {
    console.log('Configuration CORS détectée');
  } else {
    console.log('Attention: Configuration CORS non détectée');
  }
}

async function testDatabaseConnection() {
  console.log('\nTest de connexion à la base de données:');
  const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
  console.log(`Tentative de connexion à : ${mongoUri.replace(/:([^:@]{1,})@/, ':****@')}`);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connexion à la base de données réussie');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  }
}

async function testAddProduct() {
  console.log('\nTest d\'ajout de produit:');
  try {
    const response = await axios.post('http://localhost:50687/products', {
      name: 'Test Product',
      price: 9.99,
      stock: 100
    });
    console.log('Test d\'ajout de produit réussi:', response.data);
  } catch (error) {
    console.error('Erreur lors du test d\'ajout de produit:', error.message);
  }
}

async function testGetProducts() {
  console.log('\nTest de récupération des produits:');
  try {
    const response = await axios.get('http://localhost:50687/products');
    console.log('Produits récupérés:', response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error.message);
  }
}

async function runDiagnostic() {
  console.log('Variables d\'environnement :', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '******' : undefined
  });

  checkNodeVersion();
  checkProxy();
  await testBackendConnection();
  checkFolderPermissions();
  checkCorsConfig();
  await testDatabaseConnection();
  await testAddProduct();
  await testGetProducts();
}

runDiagnostic();