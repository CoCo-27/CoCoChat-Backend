import User from '../models/users.model';
import Admin from '../models/admin.model';

export const loginUser = async (req, res) => {
  try {
    console.log('user = ', 'feff');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (req.body.password == user.password) {
      res.status(200).json({
        message: 'Login Success',
      });
    } else {
      res.status(400).json({
        message: 'Password is incorrect!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const alreadyUser = await User.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res
        .status(400)
        .json({ message: `Email ${req.body.email} Already Exist!` });
    }
    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      type: 1,
    });
    await user.save();
    res.status(200).json({
      message: 'Registered Success',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went Wrong!' });
  }
};

// Admin
export const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not Exist!' });
    }

    if (req.body.password == admin.password) {
      res.status(200).json({
        message: 'Login Success',
      });
    } else {
      res.status(400).json({
        message: 'Password is incorrect!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const alreadyUser = await Admin.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res
        .status(400)
        .json({ message: `Email ${req.body.email} Already Exist!` });
    }
    const admin = await Admin.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      type: 1,
    });
    await admin.save();
    res.status(200).json({
      message: 'Registered Success',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went Wrong!' });
  }
};
