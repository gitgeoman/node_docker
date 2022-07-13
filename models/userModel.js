const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "user must have a username"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "user must have a password"],
  },
});

const User = mongoose.model("User", userSchema);
