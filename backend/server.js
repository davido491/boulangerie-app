const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const compression = require('compression');
const helmet = require('helmet');
const winston = require('winston');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' }) }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Boulangerie API',
      version: '1.0.0',
      description: 'API pour la gestion des produits de boulangerie',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 50787}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // chemin vers vos fichiers de routes
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Vérification des variables d'environnement
console.log('Variables d\'environnement :');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '******' : 'Non défini'}`);

// Connect to MongoDB
const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
console.log(`Tentative de connexion à MongoDB: ${mongoUri.replace(/:([^:@]{1,})@/, ':****@')}`);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, required: true, min: 0 },
});

const Product = mongoose.model('Product', productSchema);

// Middleware de logging pour les requêtes
app.use((req, res, next) => {
  logger.info(`Requête reçue: ${req.method} ${req.url} - Corps: ${JSON.stringify(req.body)}`);
  next();
});

// API routes

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Server error
 */
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    logger.info(`Retrieved ${products.length} products`);
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - costPrice
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               costPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
app.post('/products', async (req, res) => {
  const { name, price, costPrice } = req.body;
  console.log('Données reçues:', req.body); // Log pour déboguer

  if (!name || typeof price !== 'number' || typeof costPrice !== 'number' || price < 0 || costPrice < 0) {
    console.log('Validation échouée:', { name, price, costPrice }); // Log pour déboguer
    return res.status(400).json({ message: 'Invalid product data' });
  }

  try {
    const newProduct = new Product({ name, price, costPrice });
    await newProduct.save();
    logger.info('New product created:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  console.log(`Tentative de suppression du produit avec l'ID: ${productId}`);
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      logger.warn(`Product not found for deletion: ${productId}`);
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    logger.info('Product deleted successfully:', deletedProduct);
    res.json({ message: 'Produit supprimé avec succès', deletedProduct });
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 50787;
const server = app.listen(PORT, () => {
  const actualPort = server.address().port;
  logger.info(`Server started on port ${actualPort}`);
  // Write port to file
  const portFile = path.join(__dirname, '..', 'port.txt');
  fs.writeFileSync(portFile, actualPort.toString(), 'utf8');
  logger.info(`Port ${actualPort} written to ${portFile}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    logger.warn('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    logger.error('Server error:', e);
  }
});

module.exports = app;