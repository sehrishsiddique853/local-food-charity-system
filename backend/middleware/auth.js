import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Ensure Bearer format
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid authorization header format" });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      // Handle specific JWT errors
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      } else if (jwtErr.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
      } else if (jwtErr.name === "NotBeforeError") {
        return res.status(401).json({ message: "Token not yet valid", code: "TOKEN_NOT_VALID" });
      }
      throw jwtErr;
    }

    // Look up user by ID from decoded token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    // Attach user info to request
    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(500).json({ message: "Authentication error", code: "AUTH_ERROR" });
  }
};

export default auth;
