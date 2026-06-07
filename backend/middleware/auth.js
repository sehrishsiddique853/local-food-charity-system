// JWT authentication middleware.
// This middleware verifies an access token and loads the corresponding user.
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

const auth = async (req, res, next) => {
  try {
    // Extract token from cookie first, then fall back to Authorization header.
    let token = req.cookies?.accessToken;
    const header = req.headers.authorization;

    if (!token) {
      if (!header) {
        return errorResponse(res, 401, "TOKEN_MISSING", "No token provided");
      }

      const parts = header.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return errorResponse(res, 401, "INVALID_AUTH_HEADER", "Invalid authorization header format");
      }

      token = parts[1];
      if (!token) {
        return errorResponse(res, 401, "TOKEN_MISSING", "No token provided");
      }
    }

    // Verify JWT token and handle all common verification failures.
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return errorResponse(res, 401, "TOKEN_EXPIRED", "Token expired");
      }
      if (jwtErr.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "INVALID_TOKEN", "Invalid token");
      }
      if (jwtErr.name === "NotBeforeError") {
        return errorResponse(res, 401, "TOKEN_NOT_VALID", "Token not yet valid");
      }
      return errorResponse(res, 401, "INVALID_TOKEN", "Invalid token");
    }

    // Confirm the user still exists in the database.
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, 401, "USER_NOT_FOUND", "User not found");
    }

    if (user.isBlocked) {
      return errorResponse(res, 403, "ACCOUNT_DEACTIVATED", "Your account has been deactivated");
    }

    // Attach user identity to the request for downstream middleware/routes.
    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return errorResponse(res, 500, "AUTH_ERROR", "Authentication error");
  }
};

export default auth;
