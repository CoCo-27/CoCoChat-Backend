// Require Mongoose
import mongoose from 'mongoose';

const titleSchema = new mongoose.Schema({
  title: String,
});

const Title = mongoose.model('Title', titleSchema);

export default Title;
