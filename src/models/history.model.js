const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
      index: true,
    },

    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: [true, "Song is required"],
      index: true,
    },

    playedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const historyModel = mongoose.model("History", historySchema);

module.exports = historyModel;