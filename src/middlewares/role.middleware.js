// Valid roles define karo
const VALID_ROLES = ["user", "artist", "admin"];

function checkRole(...roles) {
  return (req, res, next) => {
    try {
      // 1. verifyJWT pehla chalyu che ke nahi
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized — Login required",
        });
      }

      // 2. User no role valid che ke nahi
      if (!VALID_ROLES.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Invalid user role",
        });
      }

      // 3. Required role match thay che ke nahi
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied — Only ${roles.join(" or ")} can perform this action`,
        });
      }

      // 4. User active che ke nahi (banned check)
      if (req.user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended",
        });
      }

      next();

    } catch (error) {
      console.error("checkRole error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
}

module.exports = { checkRole };