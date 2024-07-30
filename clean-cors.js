const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'backend', 'server.js');

fs.readFile(serverJsPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur de lecture du fichier server.js:', err);
    return;
  }

  const lines = data.split('\n');
  const corsLines = lines.filter(line => line.includes('cors'));

  if (corsLines.length > 1) {
    console.log('Plusieurs déclarations de CORS trouvées. Nettoyage en cours...');
    const cleanedLines = lines.filter(line => !line.includes('cors'));

    // Ajout d'une seule déclaration de CORS
    const corsDeclaration = `const cors = require('cors');\napp.use(cors());\n`;
    const insertIndex = cleanedLines.findIndex(line => line.includes('const app = express();')) + 1;
    cleanedLines.splice(insertIndex, 0, corsDeclaration);

    const cleanedData = cleanedLines.join('\n');
    fs.writeFile(serverJsPath, cleanedData, 'utf8', (err) => {
      if (err) {
        console.error('Erreur d\'écriture du fichier server.js:', err);
        return;
      }
      console.log('server.js nettoyé avec succès.');
    });
  } else {
    console.log('Aucune duplication de CORS trouvée. Aucune action nécessaire.');
  }
});