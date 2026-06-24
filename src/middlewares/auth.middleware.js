// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user.model");


// async function verifyJWT(req, res, next) {
//   try {
 
//     const token =
//       req.cookies?.token ||
//       req.headers["authorization"]?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token missing — Please login",
//       });
//     }

//     // 2. Token verify karo
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       // Token expire thayo ke invalid che
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({
//           success: false,
//           message: "Token expired — Please login again",
//         });
//       }
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }

//     // 3. DB ma user che ke nahi check karo
//    const user = await userModel.findById(decoded.id)
   
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found — Invalid token",
//       });
//     }

//     // 4. req.user set karo
//     req.user = user;
//     next();

//   } catch (error) {
//     console.error("verifyJWT error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Authentication failed",
//     });
//   }
// }

// module.exports = { verifyJWT };





const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function verifyJWT(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing — Please login",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired — Please login again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found — Invalid token",
      });
    }

    req.user = user;        // Full user document
    next();

  } catch (error) {
    console.error("verifyJWT error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
}

module.exports = { verifyJWT };