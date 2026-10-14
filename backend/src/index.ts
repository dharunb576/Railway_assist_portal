import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './config/constants';
import authRoutes from './routes/authRoutes';
import trainRoutes from './routes/trainRoutes';
import stationRoutes from './routes/stationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import { JSONDatabase } from './database/db';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Database Singleton
JSONDatabase.getInstance();

// Healthcheck Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    system: 'RailExpress Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 RailExpress Backend API running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
