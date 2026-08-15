const mongoose = require("mongoose");

const historyModel = require("../models/history.model");
const songModel = require("../models/song.model");


// ======================================================
// ADD SONG TO HISTORY
// POST /api/history/add
// ======================================================

const addToHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { songId } = req.body;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Check songId
    if (!songId) {
      return res.status(400).json({
        success: false,
        message: "Song ID is required.",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid song ID.",
      });
    }

    // Check song exists
    const song = await songModel.findOne({
      _id: songId,
      isPublished: true,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    // Create history
    const history = await historyModel.create({
      user: userId,
      song: songId,
      playedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Song added to history successfully.",
      data: history,
    });

  } catch (error) {
    console.error("ADD HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add song to history.",
      error: error.message,
    });
  }
};


// ======================================================
// GET USER HISTORY
// GET /api/history
// ======================================================


const getHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const history = await historyModel
      .find({ user: userId })
      .select("song playedAt")
      .populate({
        path: "song",
        select: "title thumbnail duration artist",
        populate: {
          path: "artist",
          select: "name image",
        },
      })
      .sort({ playedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Listening history fetched successfully.",
      data: history,
    });

  } catch (error) {
    console.error("GET HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch listening history.",
      error: error.message,
    });
  }
};




// ======================================================
// DELETE SINGLE HISTORY
// DELETE /api/history/:historyId
// ======================================================

const deleteHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { historyId } = req.params;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Validate history ID
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID.",
      });
    }

    // Delete only user's own history
    const deletedHistory = await historyModel.findOneAndDelete({
      _id: historyId,
      user: userId,
    });

    if (!deletedHistory) {
      return res.status(404).json({
        success: false,
        message: "History record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History deleted successfully.",
    });

  } catch (error) {
    console.error("DELETE HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete history.",
      error: error.message,
    });
  }
};


// ======================================================
// CLEAR ALL HISTORY
// DELETE /api/history/clear
// ======================================================

const clearHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Delete all history of logged-in user
    const result = await historyModel.deleteMany({
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Listening history cleared successfully.",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error("CLEAR HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear history.",
      error: error.message,
    });
  }
};


module.exports = {
  addToHistory,
  getHistory,
  deleteHistory,
  clearHistory,
};