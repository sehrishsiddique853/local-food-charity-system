import { body, validationResult } from "express-validator";
import { FIXED_SERVICE_CITY, SUPPORTED_CITIES } from "../constants/location.js";
import { errorResponse } from "../utils/apiResponse.js";

// Validation rules for the registration endpoint.
// Donor and NGO registrations require different role-specific fields.
export const validateRegister = [
  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(["donor", "ngo"]).withMessage("Role must be donor or ngo"),

  body("name")
    .custom((value, { req }) => {
      if (req.body.role !== "donor") {
        return true;
      }

      const name = typeof value === "string" ? value.trim() : "";
      if (!name) {
        throw new Error("Name is required");
      }

      if (name.length < 2 || name.length > 100) {
        throw new Error("Name must be between 2 and 100 characters");
      }

      req.body.name = name;
      return true;
    }),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)"),

  body("phone")
    .optional()
    .trim()
    .customSanitizer((value) => value.replace(/^\+92\s*/, ""))
    .matches(/^[0-9]{10}$/).withMessage("Phone must be exactly 10 digits"),

  body("location.city")
    .optional()
    .isIn([FIXED_SERVICE_CITY]).withMessage(`City is fixed to ${FIXED_SERVICE_CITY}`),

  body("location.address")
    .trim()
    .notEmpty().withMessage("Exact address is required")
    .isLength({ min: 5, max: 250 }).withMessage("Exact address must be between 5 and 250 characters"),

  // NGO-specific fields that are only required when role === "ngo".
  body("ngoName")
    .custom((value, { req }) => {
      if (req.body.role !== "ngo") {
        return true;
      }

      const ngoName = typeof value === "string" ? value.trim() : "";
      if (!ngoName) {
        throw new Error("NGO name is required for NGO role");
      }

      if (ngoName.length < 2 || ngoName.length > 100) {
        throw new Error("NGO name must be between 2 and 100 characters");
      }

      req.body.ngoName = ngoName;
      return true;
    }),

  body("ngoDocument")
    .if((value, { req }) => req.body.role === "ngo")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("NGO document is required for NGO role");
      }
      return true;
    }),

  body("ngoRegistrationNumber")
    .if((value, { req }) => req.body.role === "ngo")
    .trim()
    .notEmpty().withMessage("NGO registration number is required for NGO role"),
];

// Validation rules for the login endpoint.
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("ngoName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("NGO name must be between 2 and 100 characters"),

  body("ngoRegistrationNumber")
    .optional()
    .trim()
    .notEmpty().withMessage("NGO registration number cannot be empty"),

  body("phone")
    .optional()
    .trim()
    .customSanitizer((value) => value.replace(/^\+92\s*/, ""))
    .matches(/^[0-9]{10}$/).withMessage("Phone must be exactly 10 digits"),

  body("location.city")
    .optional()
    .isIn([FIXED_SERVICE_CITY]).withMessage(`City is fixed to ${FIXED_SERVICE_CITY}`),

  body("location.address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 250 }).withMessage("Exact address must be between 5 and 250 characters"),
];

export const validateRegistrationOtp = [
  body("otp")
    .trim()
    .notEmpty().withMessage("Verification code is required")
    .matches(/^[0-9]{6}$/).withMessage("Verification code must be 6 digits"),
];

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)"),
];

// Middleware to normalize express-validator errors into a consistent response.
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, "VALIDATION_FAILED", "Validation failed", {
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

export { FIXED_SERVICE_CITY, SUPPORTED_CITIES };
