import {
  loginUser,
  loginAdmin,
  registerUser,
  registerAdmin,
} from '../../controllers/user.controller';
import express from 'express';
const router = express.Router();

// Login Admin
router.post('/loginAdmin', loginAdmin);

//Register Admin
router.post('/registerAdmin', registerAdmin);

// Login User
router.post('/login', loginUser);

// Register User
router.post('/register', registerUser);

// Delete a User with id
// router.delete('/:id', controller.deleteUserById);
export default router;
