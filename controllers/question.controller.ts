import Question from '../models/quickQuestion';

export const createQuestion = async (req, res) => {
  try {
    const index = req.body.name.length;
    const alreadyQuestion = await Question.find();
    if (alreadyQuestion.length === 0) {
      const qusTable = await Question.create({
        question: req.body.name[0],
      });
      await qusTable.save();
    } else {
      alreadyQuestion[0].question.push(req.body.name[index - 1]);
      await alreadyQuestion[0].save();
    }
    res
      .status(200)
      .send({ data: req.body.name, message: 'Create Question Success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const question = await Question.find();
    if (!question) {
      res.status(404).send('Something went Wrong');
    } else {
      res.status(200).send({ data: question[0].question, message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editQuestion = async (req, res) => {
  try {
    const request = req.body.name;
    const question = await Question.find();
    if (question[0].question.length === request.length) {
      question[0].question.map((item, index) => {
        if (item !== request[index]) {
          question[0].question[index] = request[index];
        }
      });
      await question[0].save();
      res.status(200).send({
        data: question[0].question,
        message: 'Question Change Success',
      });
    } else if (!question) {
      res.status(404).send('Server error');
    } else {
      res.status(404).send('Something went Wrong');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const question = await Question.deleteMany();
    await question[0].save();
    res.status(200).send('Delete All Success');
  } catch (error) {}
};
