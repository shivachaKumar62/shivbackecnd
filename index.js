import express from 'express';
import './src/config/connection.js'; // Ensure connection is established
import adminRoutes from './src/routes/admin.js'; // Ensure correct relative path
import videoRoutes from './src/routes/videoRoutes.js';
import settingRoutes from "./src/routes/settingRoutes.js";
import audioRoutes from './src/routes/audioRoutes.js';
import csvRoutes from './src/routes/csvRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // Ensure this is a port above 1024

// Middleware
app.use(express.json()); // Use express built-in middleware instead of body-parser

// Routes
app.use('/admin', adminRoutes);

//videos routes
app.use('/videos', videoRoutes);

//setting routes 
app.use('/setting',settingRoutes);

//audio routes
app.use('/audio', audioRoutes);

//csv files
app.use('/csv', csvRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`Port ${PORT} requires elevated privileges`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

export default app;
