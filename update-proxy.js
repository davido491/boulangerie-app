const fs = require('fs');
const path = require('path');

function updateProxy() {
  const portFilePath = path.join(__dirname, 'port.txt');
  const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');
  
  try {
    const port = fs.readFileSync(portFilePath, 'utf8').trim();
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.proxy = `http://localhost:${port}`;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Proxy updated to http://localhost:${port}`);
  } catch (error) {
    console.error('Error updating proxy:', error);
  }
}

updateProxy();