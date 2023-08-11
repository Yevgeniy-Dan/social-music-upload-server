const asyncHandler = require("express-async-handler");

module.exports = {
  uploadPostMedia: asyncHandler(async (req, res) => {
    const { mediaUrl } = req.body;

    return res.status(200).json({ message: "Success", mediaUrl });
  }),
};
