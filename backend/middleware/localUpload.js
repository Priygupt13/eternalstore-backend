const util = require("util");
const multer = require("multer");
const { getLocalUploadDir } = require("../util/file.local")
// Max 10Mb is supported
const maxSize = 10 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("filepath: " + getLocalUploadDir());
    cb(null, getLocalUploadDir());
  },
  filename: (req, file, cb) => {
    console.log("filename: " + req.fileId);
    cb(null, req.fileId);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;