const fs = require('fs');
const path = require('path');

const productListPath = path.join(__dirname, 'frontend', 'src', 'components', 'ProductList.js');

fs.readFile(productListPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur de lecture du fichier ProductList.js:', err);
    return;
  }

  console.log('Contenu de ProductList.js :\n');
  console.log(data);
});