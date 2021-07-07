const mongoose = require("mongoose");


const TagSchema = new mongoose.Schema(
  {

    tagsArr: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tags", TagSchema);