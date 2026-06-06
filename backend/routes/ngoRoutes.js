import express from "express";
import {
  getAvailableDonations,
   getDonationById,
  getBookedDonations,
  getMyRequests,
  getRequestById,
   getRequestStats,
  cancelRequest,
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
router.get("/requests/stats", getRequestStats);
router.get("/requests", getMyRequests);
router.get("/donations/booked", getBookedDonations);
router.get("/donations/:id", getDonationById);
router.get("/requests/:id", getRequestById);
router.put("/requests/:id/cancel", cancelRequest);
router.post("/donations/:id/request", requestDonation);
router.put("/donations/:id/collect", markDonationCollected);
router.get("/history", getNgoHistory);

export default router;
