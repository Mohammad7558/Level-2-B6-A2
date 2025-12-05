import { Router } from 'express';
import auth from '../../middleware/auth';
import { vehicleController } from './vehicle.controller';

const router = Router();

// Create a new vehicle (Admin only)
router.post('/', auth('admin'), vehicleController.createVehicle);

// Get all vehicles (Public)
router.get('/', vehicleController.getAllVehicles);

// Get a single vehicle by ID (Public)
router.get('/:vehicleId', vehicleController.getVehicleById);

// Update a vehicle by ID (Admin only)
router.put('/:vehicleId', auth('admin'), vehicleController.updateVehicleById);

// Delete a vehicle by ID (Admin only)
router.delete(
  '/:vehicleId',
  auth('admin'),
  vehicleController.deleteVehicleById
);

export const vehicleRoutes = router;
