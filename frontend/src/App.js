import React from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import useProductList from './hooks/useProductList';
import ErrorComponent from './components/ErrorComponent'; // Importez le composant ErrorComponent
import ErrorBoundary from './components/ErrorBoundary'; // Importez ErrorBoundary

require('dotenv').config();

const dbHost = process.env.REACT_APP_DB_HOST;
const dbPort = process.env.REACT_APP_DB_PORT;
const dbName = process.env.REACT_APP_DB_NAME;
const dbUser = process.env.REACT_APP_DB_USER;

console.log(`Connecting to database at ${dbHost}:${dbPort}/${dbName} with user ${dbUser}`);

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
    <div className="App">
      <h1>Gestion des Produits</h1>
      <ErrorBoundary>
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
      </ErrorBoundary>
      {error && <ErrorComponent data={error} />} {/* Ajoutez le composant ErrorComponent ici */}
    </div>
  );
}

export default App;
