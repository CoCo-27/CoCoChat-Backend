import {
  loginUser,
  loginAdmin,
  logout,
  getAllUser,
  registerUser,
  registerAdmin,
  forgotPassword,
  resetPassword,
  handleGoogleAuther,
  getUser,
} from '../../controllers/user.controller';
import express from 'express';
const router = express.Router();

// Login Admin
router.post('/loginAdmin', loginAdmin);

//Register Admin
router.post('/registerAdmin', registerAdmin);

// Login User
router.post('/login', loginUser);

// Log out User
router.post('/logout', logout);

// Register User
router.post('/register', registerUser);

// handleGoogleAuther
router.post('/handleGoogleAuther', handleGoogleAuther);

// Retreive User
router.get('/getUserAll', getAllUser);

router.post('/getUser', getUser);

//forgot password
router.post('/forgotPassword', forgotPassword);

router.post('/resetPassword', resetPassword);

// Delete a User with id
// router.delete('/:id', controller.deleteUserById);
export default router;
