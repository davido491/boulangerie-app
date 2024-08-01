import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductList.css';

const ProductList = ({
  products,
  loading,
  error,
  nameFilter,
  maxPriceFilter,
  sortOrder,
  deletingProductId,
  onDeleteProduct,
  onNameFilterChange,
  onMaxPriceFilterChange,
  onSortOrderChange,
  onRefresh
}) => {
  return (
    <div className="product-list">
      <h2>Liste des Produits</h2>
      {loading && <p>Chargement des produits...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
        />
        <input
          type="number"
          placeholder="Prix max"
          value={maxPriceFilter}
          onChange={onMaxPriceFilterChange}
        />
        <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)}>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
        <button onClick={onRefresh}>Rafraîchir</button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <span>
              {product.name} - Prix: {product.price}€
              {product.costPrice !== undefined && ` - Prix de revient: ${product.costPrice}€`}
            </span>
            <button onClick={() => onDeleteProduct(product._id)} disabled={deletingProductId === product._id}>
              {deletingProductId === product._id ? 'Suppression...' : 'Supprimer'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    costPrice: PropTypes.number // Changé de .isRequired à optionnel
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  nameFilter: PropTypes.string.isRequired,
  maxPriceFilter: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  deletingProductId: PropTypes.string,
  onDeleteProduct: PropTypes.func.isRequired,
  onNameFilterChange: PropTypes.func.isRequired,
  onMaxPriceFilterChange: PropTypes.func.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default ProductList;