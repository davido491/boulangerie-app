import React from 'react';
import useProductList from '../hooks/useProductList';

const ProductComponent = () => {
  const { products, loading, error } = useProductList();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message || 'Une erreur est survenue'}</div>;
  }

  return (
    <div>
      <h1>Liste des produits</h1>
      <ul>
        {products && products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductComponent;