const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads');
  },
  filename: (req, file, callBack) => {
    // const extensionName = file.originalname
    //   .split('.')
    //   .filter(Boolean)
    //   .slice(1)
    //   .join('.');
    callBack(null, Date.now() + file.originalname);
  },
});

let upload = multer({ storage: storage }).single('file');

module.exports = {
  upload,
};
