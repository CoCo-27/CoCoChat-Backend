// Require Mongoose
import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  prompt: String,
});

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;
