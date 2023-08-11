const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const aws = require("aws-sdk");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

// Initialize AWS S3
const s3 = new aws.S3({
  apiVersion: process.env.AWS_API_VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
exports.upload = multer({
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

// Function to upload to AWS S3
const uploadToAWSS3 = (upload, req, res, next) => {
  // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
  // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
  // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
  // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
  s3.upload(upload, (err, uploadRes) => {
    if (err) {
      return res.status(422).json({
        message: "There was an error uploading file to S3 bucket",
        error: err,
      });
    } else {
      req.body.mediaUrl = uploadRes.Location;
      next();
    }
  });
};
