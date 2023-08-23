const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const { createPostMedia, uploadPost } = require("./utils/storage/upload-post");
const {
  createUserAvatar,
  uploadUserAvatar,
} = require("./utils/storage/upload-user-avatar");

const { errorHandler } = require("./middleware/error");
const errorController = require("./controllers/error");

const app = express();

app.use(compression());
app.use(helmet());

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use(limiter);

const port = process.env.PORT || 8080;

// app.use(
//   cors({
//     credentials: true,
//     origin: process.env.CLIENT_ORIGIN,
//   })
// );

app.use(cors());

app.use(bodyParser.json());
app.use("uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/post", uploadPost.single("media"), createPostMedia, postRoutes);
app.use(
  "/api/user",
  uploadUserAvatar.single("media"),
  createUserAvatar,
  userRoutes
);

app.use(errorController.get404);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Upload server was successfully launched");
});
