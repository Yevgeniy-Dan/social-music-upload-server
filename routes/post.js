const express = require("express");

const postController = require("../controllers/post");

const router = express.Router();

router.post("/create", postController.uploadPostMedia);

module.exports = router;
