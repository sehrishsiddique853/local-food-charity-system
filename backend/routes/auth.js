// Authentication routes for registration, login, profile, refresh and logout.
import express from "express";
import { register, login, getProfile, logout, refresh } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { validateRegister, validateLogin, handleValidationErrors } from "../middleware/validation.js";
// import { loginRegisterLimiter } from "../middleware/rateLimiter.js";
import normalizeRegisterBody from "../middleware/normalizeRegisterBody.js";
import { uploadNgoDocument } from "../middleware/upload.js";

const router = express.Router();

// Register a new donor/NGO/admin.
router.post(
  "/register",
  // loginRegisterLimiter,
  uploadNgoDocument.single("ngoDocument"),
  normalizeRegisterBody,
  validateRegister,
  handleValidationErrors,
  register
);
// Log in with email and password.
router.post(
  "/login",
  // loginRegisterLimiter,
  validateLogin,
  handleValidationErrors,
  login
);
// Get current authenticated user's profile.
router.get("/profile", auth, authorize("donor", "ngo", "admin"), getProfile);
// Refresh access token using refresh token cookie.
router.post("/refresh", refresh);
// Log out by revoking refresh token and clearing cookies.
router.post("/logout", logout);

export default router;
