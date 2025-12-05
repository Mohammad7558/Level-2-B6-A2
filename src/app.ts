import express, { Request, Response } from 'express';

import initDb from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { bookingRoutes } from './modules/booking/booking.route';
import { userRoutes } from './modules/user/user.route';
import { vehicleRoutes } from './modules/vehicle/vehicle.route';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the database and create tables if they don't exist
initDb();

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Vehicle Rental System API');
});

// API V1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Handle Invalid Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
