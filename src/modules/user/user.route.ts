import { Router } from 'express';
import auth from '../../middleware/auth';
import { userController } from './user.controller';

const router = Router();

// Get all users (Admin only)
router.get('/', auth('admin'), userController.GetAllUsers);

// Update a user by ID (Admin or own profile)
router.put(
  '/:userId',
  auth('admin', 'customer'),
  userController.UpdateUserById
);

// Delete a user by ID (Admin only)
router.delete('/:userId', auth('admin'), userController.DeleteUserById);

export const userRoutes = router;
