import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SalesInterface from './components/SalesInterface';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import useProductList from './hooks/useProductList';
import './app.css';

function App() {
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
    handleProductAdded,
    handleDeleteProduct,
    fetchProducts
  } = useProductList();

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestion de Boulangerie</h1>
          <nav>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/sales">Interface de Vente</Link></li>
              <li><Link to="/products">Gestion des Produits</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <h2>Bienvenue dans l'application de gestion de boulangerie</h2>
                <p>Utilisez la navigation pour accéder aux différentes fonctionnalités.</p>
              </>
            } />
            <Route path="/sales" element={<SalesInterface />} />
            <Route path="/products" element={
              <div className="product-management">
                <ProductForm onProductAdded={handleProductAdded} />
                <ProductList 
                  products={filteredAndSortedProducts}
                  loading={loading}
                  error={error}
                  nameFilter={nameFilter}
                  maxPriceFilter={maxPriceFilter}
                  sortOrder={sortOrder}
                  deletingProductId={deletingProductId}
                  onDeleteProduct={handleDeleteProduct}
                  onNameFilterChange={setNameFilter}
                  onMaxPriceFilterChange={handleMaxPriceChange}
                  onSortOrderChange={setSortOrder}
                  onRefresh={fetchProducts}
                />
              </div>
            } />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2024 Application de Gestion de Boulangerie</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;