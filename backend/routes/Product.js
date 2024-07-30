// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assurez-vous que le chemin est correct

// Route pour ajouter un produit
router.post('/', async (req, res) => {
  console.log('Received product data:', req.body); // Log pour déboguer

  try {
    const { name, price, stock } = req.body;

    // Validation basique des données
    if (!name || typeof price !== 'number' || typeof stock !== 'number') {
      console.log('Données invalides:', { name, price, stock });
      return res.status(400).json({ message: 'Données invalides' });
    }

    const newProduct = new Product({ name, price, stock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
});

module.exports = router;