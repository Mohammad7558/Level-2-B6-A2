import { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';

// Create a new vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    // Validation
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await vehicleService.createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status: availability_status || 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle',
      errors: error.message,
    });
  }
};

// Get all vehicles
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicles found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      errors: error.message,
    });
  }
};

// Get a single vehicle by ID
const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId || '';

    const result = await vehicleService.getVehicleById(parseInt(vehicleId));

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      errors: error.message,
    });
  }
};

// Update a vehicle by ID
const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId || '';
    const payload = req.body;

    // Check if vehicle exists
    const vehicleCheck = await vehicleService.getVehicleById(
      parseInt(vehicleId)
    );
    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const result = await vehicleService.updateVehicleById(
      parseInt(vehicleId),
      payload
    );

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      errors: error.message,
    });
  }
};

// Delete a vehicle by ID
const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId || '';

    const result = await vehicleService.deleteVehicleById(parseInt(vehicleId));

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting vehicle',
      errors: error.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
