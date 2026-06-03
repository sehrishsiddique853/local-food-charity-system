import express from "express";
import {
  approveDonationRequest,
  approveNgo,
  getDonationRequests,
  getPendingNgos,
  rejectDonationRequest,
  rejectNgo,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(auth, authorize("admin"));

router.get("/ngos/pending", getPendingNgos);
router.put("/ngos/:id/approve", approveNgo);
router.put("/ngos/:id/reject", rejectNgo);

router.get("/donation-requests", getDonationRequests);
router.put("/donation-requests/:id/approve", approveDonationRequest);
router.put("/donation-requests/:id/reject", rejectDonationRequest);

export default router;
