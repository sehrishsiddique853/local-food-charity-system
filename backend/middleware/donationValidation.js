import { body, validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";

const foodTypes = ["cooked", "packed", "raw", "bakery", "beverages"];
const quantityUnits = ["plates", "kg", "boxes", "packets", "bottles", "trays", "cups", "litres", "unit"];

export const validateCreateDonation = [
  body("foodTitle")
    .trim()
    .notEmpty().withMessage("Food title is required")
    .isLength({ min: 2, max: 120 }).withMessage("Food title must be between 2 and 120 characters"),

  body("foodType")
    .trim()
    .notEmpty().withMessage("Food type is required")
    .isIn(foodTypes).withMessage("Invalid food type"),

  body("quantity.value")
    .notEmpty().withMessage("Quantity value is required")
    .isFloat({ gt: 0 }).withMessage("Quantity value must be greater than 0")
    .toFloat(),

  body("quantity.unit")
    .trim()
    .notEmpty().withMessage("Quantity unit is required")
    .isIn(quantityUnits).withMessage("Invalid quantity unit"),

  body("pickupAddress.address")
    .trim()
    .notEmpty().withMessage("Pickup address is required")
    .isLength({ min: 5, max: 250 }).withMessage("Pickup address must be between 5 and 250 characters"),

  body("pickupAddress.city")
    .optional()
    .trim()
    .notEmpty().withMessage("City is required"),

  body("expiryDate")
    .notEmpty().withMessage("Expiry date is required")
    .isISO8601().withMessage("Expiry date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Expiry date must be in the future");
      }
      return true;
    }),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
];

export const validateUpdateDonation = [
  body("foodTitle")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage("Food title must be between 2 and 120 characters"),

  body("foodType")
    .optional()
    .trim()
    .isIn(foodTypes).withMessage("Invalid food type"),

  body("quantity.value")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Quantity value must be greater than 0")
    .toFloat(),

  body("quantity.unit")
    .optional()
    .trim()
    .isIn(quantityUnits).withMessage("Invalid quantity unit"),

  body("pickupAddress.address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 250 }).withMessage("Pickup address must be between 5 and 250 characters"),

  body("pickupAddress.city")
    .optional()
    .trim()
    .notEmpty().withMessage("City is required"),

  body("expiryDate")
    .optional()
    .isISO8601().withMessage("Expiry date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Expiry date must be in the future");
      }
      return true;
    }),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
];

export const handleDonationValidationErrors = (req, res, next) => {
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
