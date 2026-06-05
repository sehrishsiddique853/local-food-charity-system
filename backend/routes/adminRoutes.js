import express from "express";
import {
  approveDonationRequest,
  approveNgo,
  changeDonationStatus,
  deleteUser,
  getDonationRequests,
  getDonations,
  getNgos,
  getPendingNgos,
  getUsers,
  rejectDonationRequest,
  rejectNgo,
  verifyNgo,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(auth, authorize("admin"));

router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);

router.get("/donations", getDonations);
router.put("/status/:id", changeDonationStatus);

router.get("/requests", getDonationRequests);
router.put("/approve/:id", approveDonationRequest);
router.put("/reject/:id", rejectDonationRequest);

router.get("/ngos", getNgos);
router.put("/verify/:id", verifyNgo);
router.get("/ngos/pending", getPendingNgos);
router.put("/ngos/:id/approve", approveNgo);
router.put("/ngos/:id/reject", rejectNgo);

export default router;
