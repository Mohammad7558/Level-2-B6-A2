import { Pool } from 'pg';
import config from '.';

// PostgreSQL connection setup - NeonDB
export const pool = new Pool({
  connectionString: `${config.connectionString}`,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer'
    )
  `);

  console.log(
    "Database initialized and 'users' table created (if not exists)."
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      registration_number VARCHAR(100) NOT NULL UNIQUE,
      daily_rent_price DECIMAL(10, 2) NOT NULL,
      availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
    )
  `);

  console.log(
    "Database initialized and 'vehicles' table created (if not exists)."
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active'
    )
  `);

  console.log(
    "Database initialized and 'bookings' table created (if not exists)."
  );
};

export default initDb;
