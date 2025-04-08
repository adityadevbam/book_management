import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import { errorHandler, routeMiddleware } from './middleware';
// import { clientUse } from 'valid-ip-scope';
import bookRoutes from "./routes/book.routes"; // Import book routes
import path from "path";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
// app.use(clientUse());
app.use(routeMiddleware);

// Test Route
app.use("/hello", (_req, res) => {
  res.send("Hello World");
});

// Routes
app.use('/api/auth', authRoutes);

// Use book routes
app.use("/api/books", bookRoutes);


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log('Static uploads served from:', path.join(__dirname, 'uploads'));


// Error handling
app.use(errorHandler);
console.log("process.env", process.env.MONGODB_URI)
// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 