// Require Mongoose
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  type: String,
  reset_password_token: String,
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
