import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const useProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:50687/products');
      const validatedProducts = response.data.map(product => ({
        ...product,
        costPrice: product.costPrice !== undefined ? product.costPrice : 0, // Assurer que costPrice est défini
      }));
      setProducts(validatedProducts);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = useCallback((newProduct) => {
    const validatedProduct = {
      ...newProduct,
      costPrice: newProduct.costPrice !== undefined ? newProduct.costPrice : 0, // Assurer que costPrice est défini
    };
    setProducts((prevProducts) => [...prevProducts, validatedProduct]);
  }, []);

  const handleDeleteProduct = useCallback(async (id) => {
    setDeletingProductId(id);
    try {
      console.log(`Suppression du produit avec l'ID : ${id}`);
      const response = await axios.delete(`http://localhost:50687/products/${id}`);
      console.log(`Réponse de l'API :`, response);
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== id));
    } catch (err) {
      setError(`Erreur lors de la suppression du produit : ${err.message}`);
      console.error('Erreur lors de la suppression du produit :', err);
    } finally {
      setDeletingProductId(null);
    }
  }, []);

  const handleMaxPriceChange = useCallback((e) => {
    setMaxPriceFilter(e.target.value);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => 
        product.name.toLowerCase().includes(nameFilter.toLowerCase()) && 
        (maxPriceFilter === '' || product.price <= parseFloat(maxPriceFilter))
      )
      .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
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
    handleProductAdded,
    handleDeleteProduct,
    fetchProducts
  };
};

export default useProductList;