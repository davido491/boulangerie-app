import React, { memo, useEffect } from 'react';
import '../styles/ProductList.css';
import useProductList from '../hooks/useProductList';

const ProductList = () => {
  const {
    loading,
    error,
    nameFilter,
    maxPriceFilter,
    sortOrder,
    filteredAndSortedProducts,
    deletingProductId,
    setNameFilter,
    handleMaxPriceChange,
    setSortOrder,
    handleDeleteProduct,
    fetchProducts
  } = useProductList();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) {
    console.error('Erreur détectée:', error); // Log l'erreur pour plus de détails
    return (
      <div className="error">
        Erreur : {error.message || 'Une erreur est survenue.'}
        <button onClick={fetchProducts}>Réessayer</button>
      </div>
    );
  }

  console.log('Produits filtrés et triés:', filteredAndSortedProducts); // Ajoutez ce log

  return (
    <div className="product-list">
      <div className="filters">
        <label htmlFor="name-filter">Filtrer par nom:</label>
        <input
          id="name-filter"
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Nom du produit"
        />
        <label htmlFor="price-filter">Prix maximum:</label>
        <input
          id="price-filter"
          type="number"
          value={maxPriceFilter}
          onChange={handleMaxPriceChange}
          placeholder="Prix maximum"
        />
        <label htmlFor="sort-order">Trier par:</label>
        <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Aucun tri</option>
          <option value="asc">Prix : Croissant</option>
          <option value="desc">Prix : Décroissant</option>
        </select>
      </div>
      {Array.isArray(filteredAndSortedProducts) && filteredAndSortedProducts.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <ul>
          {Array.isArray(filteredAndSortedProducts) && filteredAndSortedProducts.map((product) => (
            <li key={product._id}>
              {product.name} - {product.price.toFixed(2)}€
              <button
                onClick={() => handleDeleteProduct(product._id)}
                disabled={deletingProductId === product._id}
              >
                {deletingProductId === product._id ? 'Suppression...' : 'Supprimer'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchProducts}>Rafraîchir les produits</button>
    </div>
  );
};

export default memo(ProductList);