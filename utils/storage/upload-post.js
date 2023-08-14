const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadToAWSS3 } = require("./s3");

// Multer storage configuration
const fileStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.toLowerCase() !== ".png" && ext.toLowerCase() !== ".jpg") {
    req.fileValidationError = true;
    return cb(null, false);
  }
  cb(null, true);
};

// Initialize multer with storage and file filter
exports.uploadPost = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// Middleware to create and process post media
exports.createPostMedia = asyncHandler(async (req, res, next) => {
  // Check for file validation error
  if (req.fileValidationError) {
    const error = new Error("Valid file extensions: [.png, .jpg]");
    error.statusCode = 422;
    throw error;
  }

  // Check if a file was uploaded
  if (req.file) {
    const filePath = req.file.path.replace("\\", "/");

    // Prepare upload parameters for AWS S3
    let upload = {
      Key: `posts/${uuidv4()}${path.extname(req.file.originalname)}`,
      Bucket: process.env.AWS_BUCKET,
      ACL: "public-read",
      ContentType: req.file.mimetype,
      Body: await sharp(filePath)
        .resize(4096, 4096, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer(),
    };

    fs.rmSync(filePath, { force: true });
    uploadToAWSS3(upload, req, res, next);
  } else {
    // If no file was uploaded, move to the next middleware
    next();
  }
});
