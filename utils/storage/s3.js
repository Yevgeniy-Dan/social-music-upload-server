const aws = require("aws-sdk");

// Initialize AWS S3
const s3 = new aws.S3({
  apiVersion: process.env.AWS_API_VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
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

module.exports = {
  uploadToAWSS3,
};
