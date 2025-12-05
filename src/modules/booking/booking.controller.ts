import { Request, Response } from 'express';
import { bookingService } from './booking.service';

// Create a new booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    // Validation
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate dates
    if (new Date(rent_end_date) <= new Date(rent_start_date)) {
      return res.status(400).json({
        success: false,
        message: 'rent_end_date must be after rent_start_date',
      });
    }

    const result = await bookingService.createBooking({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating booking',
      errors: error.message,
    });
  }
};

// Get all bookings (Admin) or user's bookings (Customer)
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    let result;

    if (user.role === 'admin') {
      result = await bookingService.getAllBookings();
      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: result.rows,
      });
    } else {
      // Customer sees only their bookings
      result = await bookingService.getBookingsByUserId(user.userId);
      return res.status(200).json({
        success: true,
        message: 'Your bookings retrieved successfully',
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      errors: error.message,
    });
  }
};

// Update booking status
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId || '';
    const { status } = req.body;
    const user = (req as any).user;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const result = await bookingService.updateBookingStatus(
      parseInt(bookingId),
      status,
      user.userId,
      user.role
    );

    if (status === 'returned') {
      res.status(200).json({
        success: true,
        message: 'Booking marked as returned. Vehicle is now available',
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result,
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating booking',
      errors: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
