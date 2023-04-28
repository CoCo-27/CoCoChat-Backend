// Require Mongoose
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  usage_tracking: {
    type: Number,
    default: 0,
  },
  billing: {
    state: {
      type: String,
    },
    value: {
      type: Number,
      default: -1,
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

const User = mongoose.model('User', userSchema);

export default User;
