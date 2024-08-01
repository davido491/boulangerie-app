import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/ProductForm.css';

function ProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: '', price: '', costPrice: '' });
    setError('');
    setSuccess(false);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      setError('Le nom du produit est requis.');
      return false;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Le prix doit être un nombre positif.');
      return false;
    }
    if (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) < 0) {
      setError('Le prix de revient doit être un nombre positif ou zéro.');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
    };

    console.log('Données du produit à envoyer:', productData);

    try {
      const response = await axios.post('http://localhost:50687/products', productData);
      console.log('Réponse du serveur:', response.data);
      onProductAdded(response.data);
      setSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      setError(`Erreur lors de l'ajout du produit: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, onProductAdded, resetForm, validateForm]);

  return (
    <div className="product-form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Ajouter un Produit</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Le produit a été ajouté avec succès !</p>}
        
        <div className="form-group">
          <label htmlFor="name">Nom du produit</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Prix (€)</label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="costPrice">Prix de revient (€)</label>
          <input
            id="costPrice"
            type="number"
            value={formData.costPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </form>
    </div>
  );
}

ProductForm.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
};

export default ProductForm;