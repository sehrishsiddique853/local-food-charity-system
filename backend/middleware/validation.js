import { body, validationResult } from "express-validator";
import { FIXED_SERVICE_CITY, SUPPORTED_CITIES } from "../constants/location.js";
import { errorResponse } from "../utils/apiResponse.js";

// Validation rules for the registration endpoint.
// Only NGO users require ngoName and ngoDocument.
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscores")
    .toLowerCase(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(/^[0-9]{10}$/).withMessage("Phone must be exactly 10 digits"),

  body("role")
    .optional()
    .isIn(["donor", "ngo", "admin"]).withMessage("Invalid role"),

  body("location.city")
    .optional()
    .isIn([FIXED_SERVICE_CITY]).withMessage(`City is fixed to ${FIXED_SERVICE_CITY}`),

  body("location.address")
    .trim()
    .notEmpty().withMessage("Exact address is required")
    .isLength({ min: 5, max: 250 }).withMessage("Exact address must be between 5 and 250 characters"),

  // NGO-specific fields that are only required when role === "ngo".
  body("ngoName")
    .if(body("role").equals("ngo"))
    .trim()
    .notEmpty().withMessage("NGO name is required for NGO role")
    .isLength({ min: 2, max: 100 }).withMessage("NGO name must be between 2 and 100 characters"),

  body("ngoDocument")
    .if(body("role").equals("ngo"))
    .notEmpty().withMessage("NGO document is required for NGO role"),

  body("ngoRegistrationNumber")
    .if(body("role").equals("ngo"))
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
