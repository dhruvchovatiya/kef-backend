const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
  {

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    hash_pw: {
        type: String,
        required: true
    },
    voted: {
      type: Array,
      required: true 
    },
    posts: {
      type: Array,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);