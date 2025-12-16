import { pool } from '../../config/db';

// Get all users
const GetAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, phone, role FROM users ORDER BY id ASC'
  );
  return result;
};

// Get a single user by ID
const GetUserById = async (userId: any) => {
  const result = await pool.query(
    'SELECT id, name, email, phone, role FROM users WHERE id = $1',
    [userId]
  );
  return result;
};

// Update a user by ID
const UpdateUserById = async (userId: any, payload: Record<string, any>) => {
  const { name, email, phone, role } = payload;

  let query = 'UPDATE users SET';
  const values: any[] = [];
  let paramCount = 1;
  let isFirst = true;

  if (name !== undefined) {
    query += `${isFirst ? '' : ','} name = $${paramCount++}`;
    values.push(name);
    isFirst = false;
  }
  if (email !== undefined) {
    query += `${isFirst ? '' : ','} email = $${paramCount++}`;
    values.push(email);
    isFirst = false;
  }
  if (phone !== undefined) {
    query += `${isFirst ? '' : ','} phone = $${paramCount++}`;
    values.push(phone);
    isFirst = false;
  }
  if (role !== undefined) {
    query += `${isFirst ? '' : ','} role = $${paramCount++}`;
    values.push(role);
    isFirst = false;
  }

  query += ` WHERE id = $${paramCount} RETURNING id, name, email, phone, role`;
  values.push(userId);

  const result = await pool.query(query, values);
  return result;
};

// Delete a user by ID
const DeleteUserById = async (userId: any) => {
  // Check if user has active bookings
  const bookingCheck = await pool.query(
    'SELECT id FROM bookings WHERE customer_id = $1 AND status = $2',
    [userId, 'active']
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, name, email, phone, role',
    [userId]
  );
  return result;
};

export const userService = {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
};
