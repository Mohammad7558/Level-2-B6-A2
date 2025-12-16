import { pool } from '../../config/db';

interface Booking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price?: number;
}

// Helper function to calculate days between dates
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Create a new booking
const createBooking = async (payload: Booking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get vehicle details
  const vehicleResult = await pool.query(
    'SELECT * FROM vehicles WHERE id = $1',
    [vehicle_id]
  );
  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const vehicle = vehicleResult.rows[0];

  // Check availability
  if (vehicle.availability_status !== 'available') {
    throw new Error('Vehicle is not available');
  }

  // Calculate total price
  const days = calculateDays(rent_start_date, rent_end_date);
  const total_price = days * vehicle.daily_rent_price;

  // Create booking
  const result = await pool.query(
    'INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      'active',
    ]
  );

  // Update vehicle availability
  await pool.query(
    'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
    ['booked', vehicle_id]
  );

  // Return booking with vehicle details
  const booking = result.rows[0];
  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

// Get all bookings
const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT b.*, 
           u.name as customer_name, u.email as customer_email,
           v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id ASC
  `);
  return result;
};

// Get bookings for a specific user
const getBookingsByUserId = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
           v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC
  `,
    [userId]
  );
  return result;
};

// Get a single booking by ID
const getBookingById = async (bookingId: number) => {
  const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [
    bookingId,
  ]);
  return result;
};

// Update booking status
const updateBookingStatus = async (
  bookingId: number,
  status: string,
  userId?: number,
  userRole?: string
) => {
  // Get current booking
  const bookingResult = await pool.query(
    'SELECT * FROM bookings WHERE id = $1',
    [bookingId]
  );
  if (bookingResult.rows.length === 0) {
    throw new Error('Booking not found');
  }

  const booking = bookingResult.rows[0];

  // Authorization check for cancellation
  if (status === 'cancelled') {
    if (userRole !== 'admin' && booking.customer_id !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    // Check if booking can be cancelled (before start date)
    const today = new Date();
    const startDate = new Date(booking.rent_start_date);
    if (today > startDate && booking.status === 'active') {
      throw new Error('Cannot cancel booking after start date');
    }
  }

  // Mark booking as returned (Admin only)
  if (status === 'returned') {
    // Update booking
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

    // Update vehicle to available
    await pool.query(
      'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
      ['available', booking.vehicle_id]
    );

    // Get updated vehicle info
    const vehicleResult = await pool.query(
      'SELECT availability_status FROM vehicles WHERE id = $1',
      [booking.vehicle_id]
    );

    return {
      ...result.rows[0],
      vehicle: {
        availability_status: vehicleResult.rows[0].availability_status,
      },
    };
  }

  // Mark as cancelled
  if (status === 'cancelled') {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

    // Update vehicle to available
    await pool.query(
      'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
      ['available', booking.vehicle_id]
    );

    return result.rows[0];
  }

  throw new Error('Invalid status update');
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBookingsByUserId,
  getBookingById,
  updateBookingStatus,
};
