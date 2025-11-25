const jwt = require("jsonwebtoken");
const User = require("../api/model/User");
const RolePermission = require("../api/model/RolePermission");
const Permission = require("../api/model/Permission");

// ✅ Admin Token Verification
const verifyToken = async (req) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role_id");
    if (!user) return null;

    return { ...decoded, role: user.role_id };
  } catch (err) {
    return null;
  }
};

// ✅ Combined Middleware (Admin OR Mobile)
const authOrAppSecret = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // 1️⃣ Check if request comes from Mobile App
      const appSecret = req.headers["x-app-secret"];
      if (appSecret && appSecret === process.env.MOBILE_APP_SECRET) {
        // Allow mobile app access without user login/permissions
        return next();
      }

      // 2️⃣ Otherwise check JWT (Admin)
      const user = await verifyToken(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token or app secret" });
      }

      req.user = user;

      // If no special permissions required, move on
      if (!requiredPermissions.length) return next();

      // Check permissions for Admin
      const roleId = user.role._id;
      const rolePerm = await RolePermission.findOne({ role_id: roleId });
      if (!rolePerm) {
        return res.status(403).json({ message: "Role has no permissions" });
      }

      const permissions = await Permission.find({
        _id: { $in: rolePerm.permission_id },
      });
      const userPermissions = permissions.map((p) => p.name);

      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Auth error", error: err.message });
    }
  };
};

module.exports = {
  authOrAppSecret,
};
