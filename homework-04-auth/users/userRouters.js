const express = require("express");
const userRouters = express.Router();

const {
  registerNewUser,
  login,
  logout,
  getCurrentUser,
  authorize,
  checkRegistrationFields,
} = require("./userControllers");

userRouters.post("/register", checkRegistrationFields, registerNewUser);
userRouters.post("/login", checkRegistrationFields, login);
userRouters.post("/logout", authorize, logout);
userRouters.get("/current", authorize, getCurrentUser)

module.exports = userRouters;
