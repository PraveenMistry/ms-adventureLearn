import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import { WorkerService } from './services/WorkerService';
import { SeedService } from './services/SeedService';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:secretpassword@localhost:27017/kids_learning_db?authSource=admin';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed initial data
    await SeedService.seedMembershipPlans();
    await SeedService.seedWorldFacts();
    await SeedService.seedBadges();
    
    // Start background workers
    WorkerService.startBackgroundTasks();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
