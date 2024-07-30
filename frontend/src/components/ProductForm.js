import React, { useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/ProductForm.css';

function ProductForm({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setPrice('');
    setStock('');
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!trimmedName || isNaN(parsedPrice) || isNaN(parsedStock) || parsedPrice < 0 || parsedStock < 0) {
      setError('Veuillez remplir tous les champs correctement. Le prix et le stock doivent être des nombres positifs.');
      setIsLoading(false);
      return;
    }

    const productData = {
      name: trimmedName,
      price: parsedPrice,
      stock: parsedStock,
    };

    console.log('URL de l\'API:', 'http://localhost:5000/products');
    console.log('Données du produit envoyées:', productData);

    try {
      const response = await axios.post('http://localhost:50687/products', productData);

      console.log('Réponse du serveur:', response.data);
      onProductAdded(response.data);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error.response?.data || error.message);
      setError(`Erreur lors de l'ajout du produit: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [name, price, stock, onProductAdded, resetForm]);

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Ajouter un Produit</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={name.trim() ? '' : 'invalid'}
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Prix (€)</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          className={!isNaN(parseFloat(price)) && parseFloat(price) >= 0 ? '' : 'invalid'}
        />
      </div>
      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
          required
          className={!isNaN(parseInt(stock, 10)) && parseInt(stock, 10) >= 0 ? '' : 'invalid'}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
}

export default ProductForm;
