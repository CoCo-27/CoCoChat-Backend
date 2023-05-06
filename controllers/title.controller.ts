import Title from '../models/title.model';

export const createTitle = async (req, res) => {
  try {
    const value = req.body.title;
    const title = await Title.create({
      title: value,
    });
    await title.save();
    res.status(200).send({ data: title, message: 'Create Title Success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTitle = async (req, res) => {
  try {
    const title = await Title.find();
    if (!title) {
      res.status(404).send('Something went Wrong');
    } else {
      res.status(200).send({ data: title, message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editTitle = async (req, res) => {
  try {
    const value = req.body.value;
    const title = await Title.find();
    if (!title) {
      return res.status(404).json({ message: 'Something went Wrong' });
    }
    title[0].title = value;
    await title[0].save();
    res.status(200).send({
      data: title[0].title,
      message: 'Title Change Success',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const title = await Title.deleteMany();
    await title[0].save();
    res.status(200).send('Delete All Success');
  } catch (error) {}
};
