const songModel = require("../models/song.model");
const historyModel = require("../models/history.model");

/*
========================================
PLAY SONG CONTROLLER
POST => /api/song/play/:id
========================================
*/

async function playSong(req, res) {
  try {
    const { id } = req.params;

    // 1. Song find karo
    const song = await songModel.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // 2. Play count increase karo
    song.plays += 1;

    await song.save();

    // 3. History save karo (optional)
    // user login hoy to history ma add karo

    if (req.user?._id) {
      await historyModel.create({
        user: req.user._id,
        song: song._id,
        playedAt: new Date(),
      });
    }

    // 4. Response
    return res.status(200).json({
      success: true,
      message: "Song played successfully",
      totalPlays: song.plays,
      data: song,
    });

  } catch (error) {
    console.log("Play Song Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  playSong,
};