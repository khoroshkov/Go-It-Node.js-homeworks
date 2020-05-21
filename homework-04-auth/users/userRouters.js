const express = require("express");
const userRouters = express.Router();
const multer = require("multer");
const path = require("path");


const { minifyImage } = require("../../homework-05-images/imgMinify");

const storage = multer.diskStorage({
  destination: "temp",
  filename: function (req, file, cb) {
    const filename = file.filename;
    const ext = path.parse(file.originalname).ext;

    cb(null, file.originalname + "_" + Date.now() + ext);
  },
});
const upload = multer({ storage });

const {
  registerNewUser,
  login,
  logout,
  getCurrentUser,
  authorize,
  checkRegistrationFields,
  updateAvatar,
  checkVerificationToken,
} = require("./userControllers");

userRouters.post("/register", checkRegistrationFields, registerNewUser);
userRouters.post("/login", checkRegistrationFields, login);
userRouters.post("/logout", authorize, logout);
userRouters.get("/current", authorize, getCurrentUser);
userRouters.post(
  "/avatar",
  upload.single("avatar"),
  minifyImage,
  (req, res, next) => {
    res.status(200).send({ message: "Avatar successfully uploaded" });
  }
);
userRouters.patch(
  "/avatar",
  upload.single("avatar"),
  minifyImage,
  updateAvatar,
  (req, res, next) => {
    res.status(200).send({ message: "Avatar successfully updated" });
  }
);

userRouters.get("/verify/:verificationToken", checkVerificationToken)

module.exports = userRouters;
