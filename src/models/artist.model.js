const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  bio: {
    type: String,
    required: [true, "Bio is required"]
  },
  image: {
    type: String,
    required: [true, "Image is required"]
  },
  imageFileId: {   
    type: String
  },
  followers: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",           
    required: [true, "User is required"]
  },
}, {
  timestamps: true
});

const artistModel = mongoose.model("Artist", artistSchema);

module.exports = artistModel;