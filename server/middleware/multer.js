const multer = require("multer");

const DIR = "./public/";

const storage = multer.diskStorage({
  diskStorage: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLocaleLowerCase().split(" ").join("_");
    cb(null, filename);
  },
});
module.exports = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .png, jpg, jpeh format allowed"));
    }
  },
});
