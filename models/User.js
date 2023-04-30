const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "User must have a name."],
    minLength: 2,
    maxLength: 30,
    validate: [
      validator.isAlphanumeric,
      "Name can only contain alphanumeric characters.",
    ],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must provide a valid email."],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "User must provide a valid password."],
    minLength: 8,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "User must provide a valid password."],
    minLength: 8,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
