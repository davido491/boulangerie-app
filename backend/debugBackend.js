const express = require('express');
const cors = require('cors');
const app = express();
const port = 50700;


app.use(cors());
app.use(express.json());

app.post('/products', (req, res) => {
  const productData = req.body;
  console.log('Données reçues du produit:', productData);

  // Logique pour ajouter un produit (exemple simplifié)
  if (productData.name && productData.price >= 0 && productData.stock >= 0) {
    res.status(201).send({ message: 'Produit ajouté avec succès', product: productData });
  } else {
    res.status(400).send({ message: 'Données du produit invalides' });
  }
});

app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});

