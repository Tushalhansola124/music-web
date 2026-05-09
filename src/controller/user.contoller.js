const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

/*
=====================================
CREATE USER
(Admin Only)
=====================================
*/
async function createUser(req, res) {
  try {

    const {
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      password,
      role,
      profileImage,
    } = req.body;

    /*
    =============================
    VALIDATION
    =============================
    */
    if (!firstName) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    if (!lastName) {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    /*
    =============================
    CHECK EXISTING USER
    =============================
    */
    const existingUser = await userModel.findOne({
      $or: [
        { username },
        { email },
        { mobileNumber },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username, email or mobile number already exists",
      });
    }

    /*
    =============================
    HASH PASSWORD
    =============================
    */
    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    =============================
    CREATE USER
    =============================
    */
    const newUser = await userModel.create({
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      password: hashedPassword,
      profileImage,
      role: role || "user",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });

  } catch (error) {
    console.log("createUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
GET ALL USERS
=====================================
*/
async function getAllUsers(req, res) {
  try {

    const users = await userModel
      .find()
      .select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.log("getAllUsers error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
GET USER BY ID
=====================================
*/
async function getUserById(req, res) {
  try {

    const { id } = req.params;

    const user = await userModel
      .findById(id)
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
    console.log("getUserById error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
UPDATE USER
=====================================
*/
async function updateUser(req, res) {
  try {

    const { id } = req.params;

    const {
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      role,
    profileImage, 

      isBlocked,
    } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (role) user.role = role;

    if (typeof isBlocked !== "undefined") {
      user.isBlocked = isBlocked;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    console.log("updateUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/*
=====================================
DELETE USER
=====================================
*/
async function deleteUser(req, res) {
  try {

    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log("deleteUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};