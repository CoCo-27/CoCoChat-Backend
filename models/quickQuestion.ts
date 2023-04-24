// Require Mongoose
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: [],
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
