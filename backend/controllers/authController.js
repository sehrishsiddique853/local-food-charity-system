// Controller layer for auth-related HTTP endpoints.
// Controllers receive request data, invoke service logic, and return structured responses.
import { successResponse } from "../utils/apiResponse.js";
import * as authService from "../services/authService.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import { notifyAdminNgoRegistration } from "../services/notificationService.js";
import { sendRegistrationOtpEmail } from "../services/emailService.js";
import {
  assertValidRegistrationOtp,
  consumeRegistrationOtp,
  createRegistrationOtp,
} from "../services/emailOtpService.js";

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
    const otpRecord = await assertValidRegistrationOtp({
      email: registerData.email,
      role: registerData.role,
      otp: registerData.otp,
    });

    if (registerData.role === "ngo" && req.file) {
      const isPdfDocument = req.file.mimetype === "application/pdf";
      const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const nameWithoutExtension = safeOriginalName.replace(/\.[^/.]+$/, "");

      const uploadedDocument = await uploadBufferToCloudinary(req.file.buffer, {
        resource_type: isPdfDocument ? "raw" : "image",
        public_id: `${Date.now()}-${isPdfDocument ? safeOriginalName : nameWithoutExtension}`,
      });

      registerData.ngoDocument = uploadedDocument.secure_url;
    }

    const { user, accessToken, refreshToken } = await authService.registerUser(registerData);

    if (user.role === "ngo") {
      await notifyAdminNgoRegistration(user);
    }

    await consumeRegistrationOtp(otpRecord._id);

    if (accessToken && refreshToken) {
      res.cookie("accessToken", accessToken, accessCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    }

    return successResponse(res, 201, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ngoVerificationStatus: user.ngoVerificationStatus,
      },
      message:
        user.role === "ngo"
          ? "NGO registration submitted. Please wait for admin approval before signing in."
          : undefined,
    });
  } catch (err) {
    return next(err);
  }
};

export const sendRegistrationOtp = async (req, res, next) => {
  try {
    await authService.assertRegistrationAvailable(req.body);

    const { otp, expiresInMinutes } = await createRegistrationOtp({
      email: req.body.email,
      role: req.body.role,
    });

    const emailInfo = await sendRegistrationOtpEmail({
      to: req.body.email,
      role: req.body.role,
      otp,
    });

    console.log("Registration OTP email result:", {
      to: req.body.email,
      accepted: emailInfo.accepted,
      rejected: emailInfo.rejected,
      response: emailInfo.response,
    });

    if (process.env.EMAIL_DEBUG_OTP === "true" && process.env.NODE_ENV !== "production") {
      console.log(`Development registration OTP for ${req.body.email}: ${otp}`);
    }

    const responseData = {
      message: "Verification code sent to your email.",
      expiresInMinutes,
    };

    return successResponse(res, 200, responseData);
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
  sendRegistrationOtp,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refresh,
  logout,
};
