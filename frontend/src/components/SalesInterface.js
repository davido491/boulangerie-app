import React, { useState, useCallback } from 'react';
import useProductList from '../hooks/useProductList';
import '../styles/SalesInterface.css';

const SalesInterface = () => {
  const { filteredAndSortedProducts, loading, error } = useProductList();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setTotal(prevTotal => prevTotal + product.price);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item._id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ).filter(item => item.quantity > 0);
      
      const removedItem = prevCart.find(item => item._id === productId);
      setTotal(prevTotal => prevTotal - removedItem.price);
      
      return updatedCart;
    });
  }, []);

  const finalizeSale = useCallback(() => {
    console.log('Vente finalisée:', cart, 'Total:', total);
    setCart([]);
    setTotal(0);
  }, [cart, total]);

  if (loading) return <div>Chargement des produits...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="sales-interface">
      <div className="product-grid">
        {filteredAndSortedProducts.map(product => (
          <button 
            key={product._id} 
            className="product-item"
            onClick={() => addToCart(product)}
          >
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price.toFixed(2)} €</div>
          </button>
        ))}
      </div>
      <div className="cart-section">
        <h2>Panier</h2>
        <ul>
          {cart.map(item => (
            <li key={item._id}>
              {item.name} x {item.quantity} - {(item.price * item.quantity).toFixed(2)} €
              <button onClick={() => removeFromCart(item._id)}>-</button>
            </li>
          ))}
        </ul>
        <div className="total">Total: {total.toFixed(2)} €</div>
        <button className="finalize-sale" onClick={finalizeSale}>Finaliser la vente</button>
      </div>
    </div>
  );
};

export default SalesInterface;