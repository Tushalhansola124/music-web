const userModel = require("../models/user.model");
const artistModel = require("../models/artist.model");
const songModel = require("../models/song.model");
const albumModel = require("../models/album.model");
const genreModel = require("../models/genre.model");
const playlistModel = require("../models/playlist.model");
const historyModel = require("../models/history.model"); 

// ==============================
// Get Dashboard Stats (Main API)
// ==============================
async function getDashboardStats(req, res) {
  try {
    // Parallel counts for better performance
    const [
      totalUsers,
      totalArtists,
      totalSongs,
      totalAlbums,
      totalGenres,
      totalPlaylists,
      totalHistory,
      publishedSongs,
      draftSongs,
      totalLikes,
      totalPlays,
    ] = await Promise.all([
      userModel.countDocuments(),
      artistModel.countDocuments(),
      songModel.countDocuments(),
      albumModel.countDocuments(),
      genreModel.countDocuments(),
      playlistModel.countDocuments(),
      historyModel.countDocuments(), // total plays history
      songModel.countDocuments({ isPublished: true }),
      songModel.countDocuments({ isPublished: false }),
      songModel.aggregate([
        { $group: { _id: null, total: { $sum: "$likes" } } },
      ]),
      songModel.aggregate([
        { $group: { _id: null, total: { $sum: "$plays" } } },
      ]),
    ]);

    // Users by role
    const usersByRole = await userModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format role counts
    const roleStats = {
      admin: 0,
      artist: 0,
      user: 0,
    };
    usersByRole.forEach((item) => {
      if (item._id) roleStats[item._id] = item.count;
    });

    // Top 5 most played songs (optional nice extra)
    const topPlayedSongs = await songModel
      .find({ isPublished: true })
      .sort({ plays: -1 })
      .limit(5)
      .select("title plays likes thumbnail artist")
      .populate("artist", "name image");

    // Top 5 most liked songs
    const topLikedSongs = await songModel
      .find({ isPublished: true })
      .sort({ likes: -1 })
      .limit(5)
      .select("title plays likes thumbnail artist")
      .populate("artist", "name image");

    // Recent 5 users
    const recentUsers = await userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName username email role createdAt");

    // Recent 5 songs
    const recentSongs = await songModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title plays likes isPublished createdAt artist")
      .populate("artist", "name");

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totals: {
          users: totalUsers,
          artists: totalArtists,
          songs: totalSongs,
          albums: totalAlbums,
          genres: totalGenres,
          playlists: totalPlaylists,
          historyPlays: totalHistory,
        },
        songStats: {
          published: publishedSongs,
          draft: draftSongs,
          totalLikes: totalLikes[0]?.total || 0,
          totalPlays: totalPlays[0]?.total || 0,
        },
        usersByRole: roleStats,
        topPlayedSongs,
        topLikedSongs,
        recentUsers,
        recentSongs,
      },
    });
  } catch (error) {
    console.log("getDashboardStats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ==============================
// Get Only Counts (Lightweight)
// ==============================
async function getDashboardCounts(req, res) {
  try {
    const [users, artists, songs, albums, genres, playlists] = await Promise.all([
      userModel.countDocuments(),
      artistModel.countDocuments(),
      songModel.countDocuments(),
      albumModel.countDocuments(),
      genreModel.countDocuments(),
      playlistModel.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard counts fetched successfully",
      data: {
        users,
        artists,
        songs,
        albums,
        genres,
        playlists,
      },
    });
  } catch (error) {
    console.log("getDashboardCounts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ==============================
// Users by Role
// ==============================
async function getUsersByRole(req, res) {
  try {
    const result = await userModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getDashboardStats,
  getDashboardCounts,
  getUsersByRole,
};