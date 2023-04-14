const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // dbName: 'ChatGPT4',
      // pass: '',
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('mongon = ', err);
    // Exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
