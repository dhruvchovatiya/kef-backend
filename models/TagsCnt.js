const mongoose = require("mongoose");


const TagCntSchema = new mongoose.Schema(
  {

    tag: {
      type: String,
      required: true,
      unique: true
    },
    cnt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TagsCnt", TagCntSchema);