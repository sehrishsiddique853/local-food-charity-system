import Donation from "../models/Donation.js";
import DonationRequest from "../models/DonationRequest.js";
import NgoVerification from "../models/ngoVerification.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  notifyDonationBooked,
  notifyNgoRequestApproved,
  notifyNgoRequestRejected,
  notifyNgoVerificationApproved,
  notifyNgoVerificationRejected,
} from "../services/notificationService.js";
import { expireStaleDonations } from "../services/donationExpiryService.js";

const getDateRange = ({ from, to } = {}) => {
  const range = {};

  if (from) {
    range.$gte = new Date(from);
  }

  if (to) {
    range.$lte = new Date(to);
  }

  return Object.keys(range).length ? range : null;
};

const removeInactiveDonationRequests = () =>
  DonationRequest.deleteMany({
    requestStatus: { $in: ["cancelled", "rejected"] },
  });

export const getPendingNgos = async (req, res, next) => {
  try {
    const ngos = await User.find({
      role: "ngo",
      ngoVerificationStatus: "pending",
    }).select("-password");

    return successResponse(res, 200, { ngos });
  } catch (err) {
    return next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const [
      totalDonors,
      totalNGOs,
      verifiedNGOs,
      pendingNGOs,
      rejectedNGOs,
      totalDonations,
      availableDonations,
      requestedDonations,
      bookedDonations,
      collectedDonations,
      expiredDonations,
      cancelledDonations,
      pendingRequests,
      approvedRequests,
    ] = await Promise.all([
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "ngo" }),
      User.countDocuments({ role: "ngo", ngoVerificationStatus: "approved" }),
      User.countDocuments({ role: "ngo", ngoVerificationStatus: "pending" }),
      User.countDocuments({ role: "ngo", ngoVerificationStatus: "rejected" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "available" }),
      DonationRequest.countDocuments({ requestStatus: "pending" }),
      Donation.countDocuments({ status: "booked" }),
      Donation.countDocuments({ status: { $in: ["collected", "completed"] } }),
      Donation.countDocuments({ status: "expired" }),
      Donation.countDocuments({ status: "cancelled" }),
      DonationRequest.countDocuments({ requestStatus: "pending" }),
      DonationRequest.countDocuments({ requestStatus: "approved" }),
    ]);

    return successResponse(res, 200, {
      totalDonors,
      totalNGOs,
      verifiedNGOs,
      pendingNGOs,
      rejectedNGOs,
      totalDonations,
      availableDonations,
      requestedDonations,
      bookedDonations,
      collectedDonations,
      expiredDonations,
      cancelledDonations,
      pendingRequests,
      approvedRequests,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    return successResponse(res, 200, { users });
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User not found");
    }

    return successResponse(res, 200, { user });
  } catch (err) {
    return next(err);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User not found");
    }

    user.isBlocked = false;
    await user.save();

    return successResponse(res, 200, {
      message: "User activated successfully",
      user,
    });
  } catch (err) {
    return next(err);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User not found");
    }

    user.isBlocked = true;
    await user.save();

    return successResponse(res, 200, {
      message: "User deactivated successfully",
      user,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User not found");
    }

    if (user.role === "donor") {
      const donations = await Donation.find({ donor: user._id });
      const donationIds = donations.map((donation) => donation._id);

      await DonationRequest.deleteMany({ donation: { $in: donationIds } });
      await Donation.deleteMany({ donor: user._id });
    }

    if (user.role === "ngo") {
      await DonationRequest.deleteMany({ ngo: user._id });
    }

    await User.deleteOne({ _id: user._id });

    return successResponse(res, 200, { message: "User deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

export const getNgos = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { role: "ngo" };
    if (status) {
      filter.ngoVerificationStatus = status;
    }

    const ngos = await User.find(filter).select("-password").sort({ createdAt: -1 });
    return successResponse(res, 200, { ngos });
  } catch (err) {
    return next(err);
  }
};

export const getNgoById = async (req, res, next) => {
  try {
    const ngo = await User.findOne({ _id: req.params.id, role: "ngo" }).select("-password");

    if (!ngo) {
      throw new ApiError(404, "NGO_NOT_FOUND", "NGO not found");
    }

    const verification = await NgoVerification.findOne({ ngo: ngo._id })
      .populate("reviewedBy", "email role")
      .sort({ updatedAt: -1 });

    return successResponse(res, 200, { ngo, verification });
  } catch (err) {
    return next(err);
  }
};

export const verifyNgo = async (req, res, next) => {
  try {
    const ngo = await User.findOne({ _id: req.params.id, role: "ngo" });

    if (!ngo) {
      throw new ApiError(404, "NGO_NOT_FOUND", "NGO not found");
    }

    ngo.ngoVerificationStatus = "approved";
    await ngo.save();

    await NgoVerification.findOneAndUpdate(
      { ngo: ngo._id },
      {
        ngo: ngo._id,
        status: "approved",
        reviewedBy: req.user.id,
        rejectionReason: undefined,
      },
      { upsert: true, new: true }
    );

    await notifyNgoVerificationApproved(ngo);

    return successResponse(res, 200, {
      message: "NGO verified successfully",
      ngo,
    });
  } catch (err) {
    return next(err);
  }
};

export const approveNgo = async (req, res, next) => {
  try {
    const ngo = await User.findOne({ _id: req.params.id, role: "ngo" });

    if (!ngo) {
      throw new ApiError(404, "NGO_NOT_FOUND", "NGO not found");
    }

    ngo.ngoVerificationStatus = "approved";
    await ngo.save();

    await NgoVerification.findOneAndUpdate(
      { ngo: ngo._id },
      {
        ngo: ngo._id,
        status: "approved",
        reviewedBy: req.user.id,
        rejectionReason: undefined,
      },
      { upsert: true, new: true }
    );

    await notifyNgoVerificationApproved(ngo);

    return successResponse(res, 200, {
      message: "NGO approved successfully",
      ngo,
    });
  } catch (err) {
    return next(err);
  }
};

export const rejectNgo = async (req, res, next) => {
  try {
    const ngo = await User.findOne({ _id: req.params.id, role: "ngo" });

    if (!ngo) {
      throw new ApiError(404, "NGO_NOT_FOUND", "NGO not found");
    }

    ngo.ngoVerificationStatus = "rejected";
    await ngo.save();

    const rejectionReason = req.body.reason || req.body.rejectionReason || "";

    await NgoVerification.findOneAndUpdate(
      { ngo: ngo._id },
      {
        ngo: ngo._id,
        status: "rejected",
        reviewedBy: req.user.id,
        rejectionReason,
      },
      { upsert: true, new: true }
    );

    await notifyNgoVerificationRejected(ngo, rejectionReason);

    return successResponse(res, 200, {
      message: "NGO rejected successfully",
      ngo,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDonations = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const donations = await Donation.find(filter)
      .populate("donor", "name email phone location")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { donations });
  } catch (err) {
    return next(err);
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email phone location")
      .populate("bookedByNgo", "ngoName email phone location ngoVerificationStatus");

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    const requests = await DonationRequest.find({ donation: donation._id })
      .populate("ngo", "ngoName email phone location ngoVerificationStatus")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { donation, requests });
  } catch (err) {
    return next(err);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    await DonationRequest.deleteMany({ donation: donation._id });
    await Donation.deleteOne({ _id: donation._id });

    return successResponse(res, 200, { message: "Donation deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

export const changeDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = [
      "available",
      "requested",
      "booked",
      "collected",
      "completed",
      "expired",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new ApiError(400, "INVALID_DONATION_STATUS", "Invalid donation status");
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    donation.status = status;
    donation.isActive = !["expired", "cancelled", "completed"].includes(status);

    await donation.save();

    return successResponse(res, 200, {
      message: "Donation status updated successfully",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDonationRequests = async (req, res, next) => {
  try {
    await expireStaleDonations();
    await removeInactiveDonationRequests();

    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.requestStatus = status;
    }

    const requests = await DonationRequest.find(filter)
      .populate("ngo", "ngoName email phone location ngoVerificationStatus")
      .populate("donation")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { requests });
  } catch (err) {
    return next(err);
  }
};

export const getDonationRequestById = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const request = await DonationRequest.findById(req.params.id)
      .populate("ngo", "ngoName email phone location ngoVerificationStatus")
      .populate({
        path: "donation",
        populate: [
          { path: "donor", select: "name email phone location" },
          { path: "bookedByNgo", select: "ngoName email phone location ngoVerificationStatus" },
        ],
      });

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Donation request not found");
    }

    return successResponse(res, 200, { request });
  } catch (err) {
    return next(err);
  }
};

export const approveDonationRequest = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Donation request not found");
    }

    if (request.requestStatus !== "pending") {
      throw new ApiError(400, "REQUEST_NOT_PENDING", "Only pending requests can be approved");
    }

    const donation = await Donation.findById(request.donation);

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    if (!donation.isActive || donation.expiryDate <= new Date()) {
      donation.status = "expired";
      donation.isActive = false;
      await donation.save();
      throw new ApiError(400, "DONATION_EXPIRED", "Donation has expired");
    }

    if (!["available", "requested"].includes(donation.status)) {
      throw new ApiError(400, "DONATION_NOT_AVAILABLE", "Donation is not available for approval");
    }

    request.requestStatus = "approved";
    request.adminMessage = req.body.adminMessage;
    await request.save();

    donation.status = "booked";
    donation.bookedByNgo = request.ngo;
    await donation.save();

    const rejectedRequests = await DonationRequest.find({
      donation: donation._id,
      _id: { $ne: request._id },
      requestStatus: "pending",
    });

    await DonationRequest.updateMany(
      {
        donation: donation._id,
        _id: { $ne: request._id },
        requestStatus: "pending",
      },
      {
        $set: {
          requestStatus: "rejected",
          adminMessage: "Another NGO was approved for this donation.",
        },
      }
    );

    await Promise.all([
      notifyDonationBooked(donation),
      notifyNgoRequestApproved(request, donation),
      ...rejectedRequests.map((rejectedRequest) =>
        notifyNgoRequestRejected(rejectedRequest, donation, "Another NGO was approved for this donation.")
      ),
    ]);

    return successResponse(res, 200, {
      message: "Donation request approved successfully",
      request,
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDonationReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const [groupedDonationStats, requested] = await Promise.all([
      Donation.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      DonationRequest.countDocuments({ requestStatus: "pending" }),
    ]);

    const stats = {
      available: 0,
      requested,
      booked: 0,
      collected: 0,
      completed: 0,
      expired: 0,
      cancelled: 0,
    };

    groupedDonationStats.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(stats, item._id)) {
        stats[item._id] = item.count;
      }
    });

    return successResponse(res, 200, stats);
  } catch (err) {
    return next(err);
  }
};

export const getUserReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const [donors, ngos, verifiedNGOs, pendingNGOs, rejectedNGOs, admins, blockedUsers] =
      await Promise.all([
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "ngo" }),
        User.countDocuments({ role: "ngo", ngoVerificationStatus: "approved" }),
        User.countDocuments({ role: "ngo", ngoVerificationStatus: "pending" }),
        User.countDocuments({ role: "ngo", ngoVerificationStatus: "rejected" }),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ isBlocked: true }),
      ]);

    return successResponse(res, 200, {
      donors,
      ngos,
      verifiedNGOs,
      pendingNGOs,
      rejectedNGOs,
      admins,
      blockedUsers,
    });
  } catch (err) {
    return next(err);
  }
};

export const getRequestReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const createdAtRange = getDateRange(req.query);
    const match = createdAtRange ? { createdAt: createdAtRange } : {};

    const groupedRequests = await DonationRequest.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$requestStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      collected: 0,
      cancelled: 0,
    };

    groupedRequests.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(stats, item._id)) {
        stats[item._id] = item.count;
        stats.total += item.count;
      }
    });

    return successResponse(res, 200, stats);
  } catch (err) {
    return next(err);
  }
};

export const getCollectionReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const createdAtRange = getDateRange(req.query);
    const dateFilter = createdAtRange ? { updatedAt: createdAtRange } : {};

    const [collectedDonations, collectedRequests, recentCollections] = await Promise.all([
      Donation.countDocuments({
        status: { $in: ["collected", "completed"] },
        ...dateFilter,
      }),
      DonationRequest.countDocuments({
        requestStatus: "collected",
        ...dateFilter,
      }),
      DonationRequest.find({
        requestStatus: "collected",
        ...dateFilter,
      })
        .populate("ngo", "ngoName email phone")
        .populate("donation", "foodTitle quantity pickupAddress updatedAt")
        .sort({ updatedAt: -1 })
        .limit(10),
    ]);

    return successResponse(res, 200, {
      collectedDonations,
      collectedRequests,
      recentCollections,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDonationTimelineReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const period = req.query.period === "weekly" ? "weekly" : "monthly";
    const createdAtRange = getDateRange(req.query);
    const match = createdAtRange ? { createdAt: createdAtRange } : {};
    const dateFormat = period === "weekly" ? "%G-W%V" : "%Y-%m";

    const timeline = await Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.period": 1 } },
    ]);

    const rowsByPeriod = new Map();

    timeline.forEach((item) => {
      const periodKey = item._id.period;
      if (!rowsByPeriod.has(periodKey)) {
        rowsByPeriod.set(periodKey, {
          period: periodKey,
          total: 0,
          available: 0,
          requested: 0,
          booked: 0,
          collected: 0,
          completed: 0,
          expired: 0,
          cancelled: 0,
        });
      }

      const row = rowsByPeriod.get(periodKey);
      row[item._id.status] = item.count;
      row.total += item.count;
    });

    return successResponse(res, 200, {
      period,
      timeline: Array.from(rowsByPeriod.values()),
    });
  } catch (err) {
    return next(err);
  }
};

export const getNgoPerformanceReport = async (req, res, next) => {
  try {
    await expireStaleDonations();

    const performance = await DonationRequest.aggregate([
      {
        $group: {
          _id: "$ngo",
          totalRequests: { $sum: 1 },
          pendingRequests: {
            $sum: { $cond: [{ $eq: ["$requestStatus", "pending"] }, 1, 0] },
          },
          approvedRequests: {
            $sum: { $cond: [{ $eq: ["$requestStatus", "approved"] }, 1, 0] },
          },
          rejectedRequests: {
            $sum: { $cond: [{ $eq: ["$requestStatus", "rejected"] }, 1, 0] },
          },
          collectedRequests: {
            $sum: { $cond: [{ $eq: ["$requestStatus", "collected"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "ngo",
        },
      },
      { $unwind: "$ngo" },
      {
        $project: {
          _id: 0,
          ngoId: "$ngo._id",
          ngoName: "$ngo.ngoName",
          email: "$ngo.email",
          verificationStatus: "$ngo.ngoVerificationStatus",
          totalRequests: 1,
          pendingRequests: 1,
          approvedRequests: 1,
          rejectedRequests: 1,
          collectedRequests: 1,
        },
      },
      { $sort: { collectedRequests: -1, totalRequests: -1 } },
    ]);

    return successResponse(res, 200, { performance });
  } catch (err) {
    return next(err);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await User.findOne({ _id: req.user.id, role: "admin" }).select("-password");

    if (!admin) {
      throw new ApiError(404, "ADMIN_NOT_FOUND", "Admin profile not found");
    }

    return successResponse(res, 200, { admin });
  } catch (err) {
    return next(err);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await User.findOne({ _id: req.user.id, role: "admin" });

    if (!admin) {
      throw new ApiError(404, "ADMIN_NOT_FOUND", "Admin profile not found");
    }

    const { name, email, phone, location } = req.body;

    if (email && email !== admin.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: admin._id } });
      if (existingEmail) {
        throw new ApiError(409, "EMAIL_ALREADY_EXISTS", "Email already in use");
      }
      admin.email = email;
    }

    if (phone && phone !== admin.phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: admin._id } });
      if (existingPhone) {
        throw new ApiError(409, "PHONE_ALREADY_EXISTS", "Phone number already in use");
      }
      admin.phone = phone;
    }

    if (name !== undefined) {
      admin.name = name;
    }

    if (location?.address) {
      admin.location.address = location.address;
    }

    await admin.save();

    const updatedAdmin = await User.findById(admin._id).select("-password");
    return successResponse(res, 200, {
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    return next(err);
  }
};

export const rejectDonationRequest = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Donation request not found");
    }

    if (request.requestStatus !== "pending") {
      throw new ApiError(400, "REQUEST_NOT_PENDING", "Only pending requests can be rejected");
    }

    const donation = await Donation.findById(request.donation);

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    if (donation.status !== "booked" && donation.status !== "collected" && donation.status !== "completed") {
      const activeRequestsForDonation = await DonationRequest.countDocuments({
        donation: donation._id,
        _id: { $ne: request._id },
        requestStatus: { $in: ["pending", "approved"] },
      });

      if (activeRequestsForDonation === 0 && donation.isActive && donation.expiryDate > new Date()) {
        donation.status = "available";
        donation.bookedByNgo = null;
        await donation.save();
      }
    }

    const adminMessage = req.body.adminMessage || req.body.reason || "Request rejected by admin.";
    await notifyNgoRequestRejected(request, donation, adminMessage);
    await DonationRequest.deleteOne({ _id: request._id });

    return successResponse(res, 200, {
      message: "Donation request rejected successfully",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};
