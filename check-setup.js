const fs = require('fs');
const path = require('path');
const http = require('http');

const portFilePath = path.join(__dirname, 'port.txt');
const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');

// Lire le port depuis le fichier port.txt
function getBackendPort() {
  try {
    return fs.readFileSync(portFilePath, 'utf8').trim();
  } catch (error) {
    console.error('Error reading port file:', error);
    return null;
  }
}

const backendPort = getBackendPort();

// Vérifier si le backend est en cours d'exécution
function checkBackend() {
  return new Promise((resolve, reject) => {
    if (!backendPort) {
      reject('Unable to determine backend port');
      return;
    }

    const options = {
      hostname: 'localhost',
      port: backendPort,
      path: '/products',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(`Backend is running and responding correctly on port ${backendPort}.`);
      } else {
        reject(`Backend responded with status code: ${res.statusCode}`);
      }
    });

    req.on('error', (e) => {
      reject(`Backend is not running on port ${backendPort}: ${e.message}`);
    });

    req.end();
  });
}

// Vérifier le proxy dans package.json
function checkPackageJson() {
  return new Promise((resolve, reject) => {
    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading package.json: ${err.message}`);
      } else {
        const packageJson = JSON.parse(data);
        if (packageJson.proxy === `http://localhost:${backendPort}`) {
          resolve('package.json proxy is correctly configured.');
        } else {
          reject(`package.json proxy is incorrectly configured: ${packageJson.proxy}`);
        }
      }
    });
  });
}

// Exécuter toutes les vérifications
async function runChecks() {
  try {
    const backendCheck = await checkBackend();
    console.log(backendCheck);

    const packageJsonCheck = await checkPackageJson();
    console.log(packageJsonCheck);

    console.log('All checks passed successfully!');
  } catch (error) {
    console.error('Check failed:', error);
  }
}

runChecks();