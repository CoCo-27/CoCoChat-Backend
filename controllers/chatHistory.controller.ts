import ChatHistory from '../models/chatHistory.model';

export const getHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.find({ user_id: req.body.email });
    // const chatHistory = await ChatHistory.find({user_id: {$in: req.body.email}, date: {$in: }})
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
    console.log('Get Controller = ', history);

    res.status(200).json({ data: history, message: 'Success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
