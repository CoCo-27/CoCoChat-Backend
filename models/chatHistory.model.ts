import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  user_id: String,
  human_message: String,
  ai_message: String,
  date: Date,
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
