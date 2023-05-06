import ChatHistory from '../models/chatHistory.model';

export const getHistory = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(404).json({ message: 'Parameter error' });
    }
    const chatHistory = await ChatHistory.find({ user_id: req.body.email });
    let history = [];
    if (!chatHistory.length) {
      return res.status(404).json({ message: 'No history' });
    } else {
      chatHistory.map((item, index) => {
        history.push(
          { message: item.human_message, flag: false },
          { message: item.ai_message, flag: true }
        );
      });
    }

    res.status(200).json({ data: history, message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
