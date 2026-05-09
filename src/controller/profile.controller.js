const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { uploadFile, deleteFile } = require("../services/storage.services");


/*
=====================================
GET PROFILE
=====================================
*/
async function getProfile(req, res) {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.log("getProfile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
UPDATE PROFILE
=====================================
*/
async function updateProfile(req, res) {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      password,
      bio,
    } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    ==============================
    UPDATE TEXT FIELDS
    ==============================
    */
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (bio) user.bio = bio;

    /*
    ==============================
    UPDATE PASSWORD
    ==============================
    */
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    /*
    ==============================
    PROFILE IMAGE UPDATE
    ==============================
    */
    if (req.file) {

      // Old image delete
      if (user.profileImageFileId) {
        await deleteFile(user.profileImageFileId);
      }

      // Upload new image
      const uploadResult = await uploadFile(
        req.file.buffer.toString("base64"),
        "music_app/profile"
      );

      user.profileImage = uploadResult.url;
      user.profileImageFileId = uploadResult.fileId;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });

  } catch (error) {
    console.log("updateProfile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
DELETE PROFILE
=====================================
*/
async function deleteProfile(req, res) {
  try {

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete image from ImageKit
    if (user.profileImageFileId) {
      await deleteFile(user.profileImageFileId);
    }

    await userModel.findByIdAndDelete(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });

  } catch (error) {
    console.log("deleteProfile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};