const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const folderPath = `public/${folderName}`;
      createFolderIfNotExists(folderPath);
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      "Error: Only images (jpeg, jpg, png), PDFs, and MS Word (doc, docx) files are allowed!"
    );
  }
};

const upload = (folderName) =>
  multer({
    storage: storage(folderName),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter,
  });

module.exports = upload;
