const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes("@"),
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

const userModel = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator, {
  message: "This Email is already in use! Try another one.",
});

module.exports = userModel;
