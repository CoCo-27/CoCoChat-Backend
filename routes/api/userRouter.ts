import {
  loginUser,
  loginAdmin,
  registerUser,
} from '../../controllers/user.controller';
import express from 'express';
const router = express.Router();

// Login Admin
router.post('/loginAdmin', loginAdmin);

// Login User
router.post('/login', loginUser);

// Register User
router.post('/register', registerUser);

// Delete a User with id
// router.delete('/:id', controller.deleteUserById);
export default router;
