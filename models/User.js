const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  user_pass: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
