const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/avatar/create", userController.uploadAvatar);

module.exports = router;
