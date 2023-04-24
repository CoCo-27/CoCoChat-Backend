import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/users.model';
import Admin from '../models/admin.model';
import { newsLetterEmail, welcomeEmail } from '../template/template';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rober.smith2493@gmail.com',
    pass: 'dlqqkjpqoqcxwrgt',
  },
});

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: 'Password is invalid' });
        }
        let token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, {
          expiresIn: 3600,
        });
        return res.status(200).json({
          data: {
            email: user.email,
            accessToken: token,
          },
          message: 'Login Success',
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Something went Wrong' });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const alreadyUser = await User.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res
        .status(400)
        .json({ message: 'Email already Exist. Please Login!' });
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: encryptedPassword,
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

    bcrypt
      .compare(req.body.password, admin.password)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: 'Password is invalid' });
        }
        let token = jwt.sign({ id: admin.id }, process.env.TOKEN_KEY, {
          expiresIn: 3600,
        });
        return res.status(200).json({
          data: {
            email: admin.email,
            accessToken: token,
          },
          message: 'Login Success',
        });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Something went Wrong' });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const alreadyUser = await Admin.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res.status(400).json({ message: `Email already Exist!` });
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const admin = await Admin.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: encryptedPassword,
      type: 1,
    });
    await admin.save();
    res.status(200).json({
      message: 'Registered Success',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went Wrong' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Email is not correct' });
    }
    let token = jwt.sign({ email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: 3600,
    });

    // const output = Newsletter(token);
    let output = newsLetterEmail(token);

    user.reset_password_token = token;
    await user.save();
    const mailOptions = {
      from: 'rober.smith2493@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      html: output,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        return res
          .status(200)
          .json({ data: token, message: 'Email sent Success' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went Wrong' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    const { token, password } = req.body;
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Unauthorized!',
        });
      } else {
        console.log(decoded);
        const user = await User.findOne({ email: decoded.email });
        if (user && token === user.reset_password_token) {
          const encryptedPassword = await bcrypt.hash(password, 10);
          user.email = decoded.email;
          user.password = encryptedPassword;
          await user.save();
          return res.status(200).json({ message: 'Reset Password Success' });
        }
        return res.status(404).json({
          message: 'Something went Wrong. Please try to reset password again',
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
