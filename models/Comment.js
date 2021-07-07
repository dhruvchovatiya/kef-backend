const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema(
  {

    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);

