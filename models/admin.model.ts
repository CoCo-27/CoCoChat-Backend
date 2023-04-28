// Require Mongoose
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  type: { type: String, require: true },
  reset_password_token: String,
  billing: {
    state: {
      type: String,
    },
    start_at: {
      type: String,
    },
    end_at: {
      type: String,
    },
  },
  start_date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
