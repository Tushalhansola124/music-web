const userModel = require("../models/user.model");
const artistModel = require("../models/artist.model");

async function followArtist(req, res) {
  try {
    const userId = req.user._id;
    const { artistId } = req.params;

    const artist = await artistModel.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const user = await userModel.findById(userId);

    // Already followed?
    if (user.followingArtists.includes(artistId)) {
      return res.status(400).json({ message: "Already following" });
    }

    user.followingArtists.push(artistId);
    await user.save();

    // Increase follower count
    artist.followers += 1;
    await artist.save();

    return res.status(200).json({
      success: true,
      message: "Artist followed successfully",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function unfollowArtist(req, res) {
  try {
    const userId = req.user._id;
    const { artistId } = req.params;

    const user = await userModel.findById(userId);
    const artist = await artistModel.findById(artistId);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    user.followingArtists = user.followingArtists.filter(
      id => id.toString() !== artistId
    );

    await user.save();

    // Decrease follower count
    artist.followers = Math.max(0, artist.followers - 1);
    await artist.save();

    return res.status(200).json({
      success: true,
      message: "Artist unfollowed",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getFollowing(req, res) {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("followingArtists");

    return res.status(200).json({
      success: true,
      data: user.followingArtists,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function isFollowing(req, res) {
  try {
    const { artistId } = req.params;

    const user = await userModel.findById(req.user._id);

    const isFollow = user.followingArtists.includes(artistId);

    return res.status(200).json({
      success: true,
      isFollowing: isFollow,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
module.exports = { followArtist ,unfollowArtist,getFollowing,isFollowing}