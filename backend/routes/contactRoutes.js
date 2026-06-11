import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import { handleValidationErrors, validateContactMessage } from "../middleware/validation.js";

const router = express.Router();

router.post("/", validateContactMessage, handleValidationErrors, sendContactMessage);

export default router;
