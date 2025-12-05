import { pool } from '../../config/db';

interface Vehicle {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

// Create a new vehicle
const createVehicle = async (payload: Vehicle) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

// Get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query('SELECT * FROM vehicles ORDER BY id ASC');
  return result;
};

// Get a single vehicle by ID
const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [
    vehicleId,
  ]);
  return result;
};

// Update a vehicle by ID
const updateVehicleById = async (
  vehicleId: number,
  payload: Partial<Vehicle>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  let query = 'UPDATE vehicles SET updated_at = NOW()';
  const values: any[] = [];
  let paramCount = 1;

  if (vehicle_name !== undefined) {
    query += `, vehicle_name = $${paramCount++}`;
    values.push(vehicle_name);
  }
  if (type !== undefined) {
    query += `, type = $${paramCount++}`;
    values.push(type);
  }
  if (registration_number !== undefined) {
    query += `, registration_number = $${paramCount++}`;
    values.push(registration_number);
  }
  if (daily_rent_price !== undefined) {
    query += `, daily_rent_price = $${paramCount++}`;
    values.push(daily_rent_price);
  }
  if (availability_status !== undefined) {
    query += `, availability_status = $${paramCount++}`;
    values.push(availability_status);
  }

  query += ` WHERE id = $${paramCount} RETURNING *`;
  values.push(vehicleId);

  const result = await pool.query(query, values);
  return result;
};

// Delete a vehicle by ID
const deleteVehicleById = async (vehicleId: number) => {
  // Check if vehicle has active bookings
  const bookingCheck = await pool.query(
    'SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2',
    [vehicleId, 'active']
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete vehicle with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM vehicles WHERE id = $1 RETURNING *',
    [vehicleId]
  );
  return result;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
