import express from "express";
import {
  createDonation,
  deleteDonation,
  getDonationById,
  getDonationHistory,
  getMyDonationStats,
  getMyDonations,
  updateDonation,
} from "../controllers/donationController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import normalizeDonationBody from "../middleware/normalizeDonationBody.js";
import { uploadDonationImages } from "../middleware/upload.js";
import {
  handleDonationValidationErrors,
  validateCreateDonation,
  validateUpdateDonation,
} from "../middleware/donationValidation.js";

const router = express.Router();

router.use(auth, authorize("donor"));

router.post(
  "/",
  uploadDonationImages.array("images", 5),
  normalizeDonationBody,
  validateCreateDonation,
  handleDonationValidationErrors,
  createDonation
);

router.get("/my", getMyDonations);
router.get("/my/stats", getMyDonationStats);
router.get("/my-donations", getMyDonations);
router.get("/history", getDonationHistory);
router.get("/:id", getDonationById);

router.put(
  "/:id",
  uploadDonationImages.array("images", 5),
  normalizeDonationBody,
  validateUpdateDonation,
  handleDonationValidationErrors,
  updateDonation
);

router.delete("/:id", deleteDonation);

export default router;
