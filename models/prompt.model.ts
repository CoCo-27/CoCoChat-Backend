// Require Mongoose
import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  prompt: String,
});

const Admin = mongoose.model('Prompt', promptSchema);

export default Admin;
