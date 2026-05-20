// Service layer for authentication and user token operations.
// Services contain business logic and database interactions.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import ApiError from "../utils/ApiError.js";

// Create a signed JWT access token containing the user id and role.
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Create a signed refresh token used to issue new access tokens later.
const generateRefreshToken = () => {
  return jwt.sign({ type: "refresh" }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Persist refresh tokens in the database for revocation support.
const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ user: userId, token, expiresAt });
};

export const registerUser = async ({ name, email, password, phone, role, ngoName, ngoDocument }) => {
  // Prevent duplicate email and phone registrations.
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "EMAIL_ALREADY_EXISTS", "Email already in use");
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(409, "PHONE_ALREADY_EXISTS", "Phone number already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const normalizedRole = role ? role.toLowerCase() : "donor";

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: normalizedRole,
    ngoName: normalizedRole === "ngo" ? ngoName : undefined,
    ngoDocument: normalizedRole === "ngo" ? ngoDocument : undefined,
    ngoVerificationStatus: normalizedRole === "ngo" ? "pending" : undefined,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user._id, refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user._id, refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const getProfileById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await RefreshToken.deleteOne({ token: refreshToken });
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "REFRESH_TOKEN_MISSING", "Refresh token not provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (jwtErr) {
    if (jwtErr.name === "TokenExpiredError") {
      throw new ApiError(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired");
    }
    throw new ApiError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken }).populate("user", "-password");
  if (!storedToken) {
    throw new ApiError(401, "REFRESH_TOKEN_REVOKED", "Refresh token not found");
  }

  const user = storedToken.user;
  if (!user) {
    throw new ApiError(401, "USER_NOT_FOUND", "User not found");
  }

  const accessToken = generateAccessToken(user);
  return {
    user,
    accessToken,
  };
};
