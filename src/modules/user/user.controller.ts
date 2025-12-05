import { Request, Response } from 'express';
import { userService } from './user.service';

// Get all users (Admin only)
const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      errors: error.message,
    });
  }
};

// Update a user by ID (Admin or own profile)
const UpdateUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId || '';
  const user = (req as any).user;
  const payload = req.body;

  try {
    // Authorization check
    if (user.role !== 'admin' && user.userId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own profile',
      });
    }

    // Check if user exists
    const userCheck = await userService.GetUserById(userId);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const result = await userService.UpdateUserById(userId, payload);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      errors: error.message,
    });
  }
};

// Delete a user by ID (Admin only)
const DeleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const result = await userService.DeleteUserById(userId);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error deleting user',
      errors: error.message,
    });
  }
};

export const userController = {
  GetAllUsers,
  UpdateUserById,
  DeleteUserById,
};
