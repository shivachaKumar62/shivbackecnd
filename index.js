import express from 'express';
import './src/config/connection.js'; // Ensure connection is established
import adminRoutes from './src/routes/admin.js'; // Ensure correct relative path
import settingRoutes from "./src/routes/settingRoutes.js";
import fileRoutes from './src/routes/filesRoutes.js';
import csvRoutes from './src/routes/csvRoutes.js';
import userRoutes from "./src/routes/userRoutes.js";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // Ensure this is a port above 1024

// Middleware
app.use(express.json()); // Use express built-in middleware instead of body-parser

app.use(cors());

// Routes
app.use('/admin', adminRoutes);

//setting routes 
app.use('/setting',settingRoutes);

//audio routes
app.use('/file', fileRoutes);

//csv files
app.use('/csv', csvRoutes);

//user routes
app.use('/user', userRoutes);



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
