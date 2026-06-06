// Controller layer for auth-related HTTP endpoints.
// Controllers receive request data, invoke service logic, and return structured responses.
import { successResponse } from "../utils/apiResponse.js";
import * as authService from "../services/authService.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

// Cookie settings for access and refresh tokens.
// Access tokens are short-lived, refresh tokens are longer-lived.
const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register a new user.
// Delegates validation to middleware and business logic to authService.
export const register = async (req, res, next) => {
  try {
    const registerData = { ...req.body };

    if (registerData.role === "ngo" && req.file) {
      const uploadedDocument = await uploadBufferToCloudinary(req.file.buffer, {
        public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`,
      });

      registerData.ngoDocument = uploadedDocument.secure_url;
    }

    const { user, accessToken, refreshToken } = await authService.registerUser(registerData);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return successResponse(res, 201, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Log in a user and issue new tokens.
export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return successResponse(res, 200, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Get the current authenticated user's profile.
export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfileById(req.user.id);
    return successResponse(res, 200, { user });
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfileById(req.user.id, req.body);
    return successResponse(res, 200, {
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    return next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePasswordById(req.user.id, req.body);
    return successResponse(res, 200, {
      message: "Password changed successfully",
    });
  } catch (err) {
    return next(err);
  }
};

// Log out a user by deleting the stored refresh token and clearing cookies.
export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.cookies?.refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, 200, { message: "Logged out successfully" });
  } catch (err) {
    return next(err);
  }
};

// Refresh the access token using a valid refresh token.
export const refresh = async (req, res, next) => {
  try {
    const { user, accessToken } = await authService.refreshAccessToken(req.cookies?.refreshToken);
    res.cookie("accessToken", accessToken, accessCookieOptions);

    return successResponse(res, 200, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refresh,
  logout,
};
