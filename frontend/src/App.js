import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, TextField, Paper, Typography, Grid, 
  CircularProgress, Box, Container 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import useProductList from './hooks/useProductList';
import ErrorComponent from './components/ErrorComponent';
import ErrorBoundary from './components/ErrorBoundary';
import * as brain from './brain';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  result: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [brainInput, setBrainInput] = useState([0, 0]);
  const [brainOutput, setBrainOutput] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    loading: productLoading,
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

  const debugBrainJS = useCallback(() => {
    console.log('Démarrage du débogage Brain.js');
    setDebugInfo('Débogage en cours...');
    
    try {
      brain.debugBrainJS();
      setDebugInfo(prev => prev + '\nDébogage Brain.js terminé avec succès.');
    } catch (error) {
      console.error('Erreur lors du débogage Brain.js:', error);
      setDebugInfo(prev => prev + `\nErreur lors du débogage Brain.js: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    debugBrainJS();
  }, [debugBrainJS]);

  const predict = useCallback(() => {
    setLoading(true);
    console.log(`Prédiction pour l'entrée: [${brainInput}]`);
    try {
      const output = brain.predictWithDebug(brainInput);
      setBrainOutput(output);
      console.log(`Sortie: ${output}`);
      setDebugInfo(prev => prev + `\nPrédiction - Entrée: [${brainInput}], Sortie: ${output}`);
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error);
      setDebugInfo(prev => prev + `\nErreur lors de la prédiction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [brainInput]);

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>Gestion des Produits</Typography>
      
      <Paper className={classes.root}>
        <Typography variant="h5" gutterBottom>Brain.js Prediction</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              className={classes.input}
              label="Input 1"
              type="number"
              value={brainInput[0]}
              onChange={(e) => setBrainInput([Number(e.target.value), brainInput[1]])}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              className={classes.input}
              label="Input 2"
              type="number"
              value={brainInput[1]}
              onChange={(e) => setBrainInput([brainInput[0], Number(e.target.value)])}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={predict}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Predict'}
        </Button>
        {brainOutput !== null && (
          <Box className={classes.result}>
            <Typography variant="h6">Result:</Typography>
            <Typography>{brainOutput[0]}</Typography>
          </Box>
        )}
      </Paper>

      <Box mt={3}>
        <Typography variant="h6">Informations de débogage Brain.js:</Typography>
        <pre>{debugInfo}</pre>
      </Box>

      <ErrorBoundary>
        <ProductForm onProductAdded={handleProductAdded} />
        <ProductList 
          products={filteredAndSortedProducts}
          loading={productLoading}
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
      {error && <ErrorComponent data={error} />}
    </Container>
  );
}

export default App;