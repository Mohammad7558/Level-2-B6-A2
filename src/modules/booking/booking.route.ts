import { Router } from 'express';
import auth from '../../middleware/auth';
import { bookingController } from './booking.controller';

const router = Router();

// Create a new booking (Customer or Admin)
router.post('/', auth('customer', 'admin'), bookingController.createBooking);

// Get bookings (Admin sees all, Customer sees own)
router.get('/', auth('customer', 'admin'), bookingController.getAllBookings);

// Update booking status (Customer: cancel, Admin: mark as returned)
router.put(
  '/:bookingId',
  auth('customer', 'admin'),
  bookingController.updateBooking
);

export const bookingRoutes = router;
