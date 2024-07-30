import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const useProductList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:50687/products');
      console.log('Réponse reçue:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setError(error.message || 'Une erreur est survenue lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleMaxPriceChange = useCallback((e) => {
    const value = e.target.value;
    setMaxPriceFilter(value === '' ? '' : Number(value));
  }, []);

  const handleDeleteProduct = useCallback(async (productId) => {
    setDeletingProductId(productId);
    try {
      await axios.delete(`http://localhost:50687/products/${productId}`);
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la suppression du produit');
    } finally {
      setDeletingProductId(null);
    }
  }, []);

  const handleProductAdded = useCallback((newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => product.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(product => maxPriceFilter === '' || product.price <= maxPriceFilter)
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        if (sortOrder === 'desc') return b.price - a.price;
        return 0;
      });
  }, [products, nameFilter, maxPriceFilter, sortOrder]);

  return {
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
    handleProductAdded,
    fetchProducts
  };
};

export default useProductList;
