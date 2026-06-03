import express from "express";
import {
  getAvailableDonations,
  getBookedDonations,
  getMyRequests,
  getNgoHistory,
  markDonationCollected,
  requestDonation,
} from "../controllers/ngoController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import ensureNgoApproved from "../middleware/ensureNgoApproved.js";

const router = express.Router();

router.use(auth, authorize("ngo"), ensureNgoApproved);

router.get("/donations/available", getAvailableDonations);
router.post("/donations/:id/request", requestDonation);
router.get("/requests", getMyRequests);
router.get("/donations/booked", getBookedDonations);
router.put("/donations/:id/collect", markDonationCollected);
router.get("/history", getNgoHistory);

export default router;
