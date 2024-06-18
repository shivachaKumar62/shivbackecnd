import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = 8000; // Ensure this is the same port as in your index.js

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description: 'A simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Get the current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your route files
const routesPath = path.resolve(__dirname, './src/routes');

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: [`${routesPath}/*.js`, './index.js'], // Include the main index.js file too if it contains routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);



export default swaggerSpec;
