import express from "express";
import {
  activateUser,
  approveDonationRequest,
  approveNgo,
  changeDonationStatus,
  deactivateUser,
  deleteDonation,
  deleteUser,
  getDashboardStats,
  getDonationById,
  getDonationRequests,
  getDonationReport,
  getDonations,
  getDonationRequestById,
  getNgoById,
  getNgos,
  getPendingNgos,
  getUserById,
  getUserReport,
  getUsers,
  rejectDonationRequest,
  rejectNgo,
  verifyNgo,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(auth, authorize("admin"));

router.get("/dashboard", getDashboardStats);

router.get("/users", getUsers);
router.get("/users/donors", (req, res, next) => {
  req.query.role = "donor";
  return getUsers(req, res, next);
});
router.get("/users/ngos", (req, res, next) => {
  req.query.role = "ngo";
  return getUsers(req, res, next);
});
router.get("/users/:id", getUserById);
router.put("/users/:id/activate", activateUser);
router.put("/users/:id/deactivate", deactivateUser);
router.delete("/user/:id", deleteUser);

router.get("/donations", getDonations);
router.get("/donations/:id", getDonationById);
router.delete("/donations/:id", deleteDonation);
router.put("/status/:id", changeDonationStatus);

router.get("/requests", getDonationRequests);
router.get("/requests/:id", getDonationRequestById);
router.put("/requests/:id/approve", approveDonationRequest);
router.put("/requests/:id/reject", rejectDonationRequest);
router.put("/approve/:id", approveDonationRequest);
router.put("/reject/:id", rejectDonationRequest);

router.get("/ngos", getNgos);
router.get("/ngos/pending", getPendingNgos);
router.get("/ngos/:id", getNgoById);
router.put("/ngos/:id/approve", approveNgo);
router.put("/ngos/:id/reject", rejectNgo);
router.put("/verify/:id", verifyNgo);

router.get("/reports/donations", getDonationReport);
router.get("/reports/users", getUserReport);

export default router;
