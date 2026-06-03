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

export const getDonationRequests = async (req, res, next) => {
  try {
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

export const approveDonationRequest = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Donation request not found");
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

export const rejectDonationRequest = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Donation request not found");
    }

    const donation = await Donation.findById(request.donation);

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    request.requestStatus = "rejected";
    request.adminMessage = req.body.adminMessage || req.body.reason || "";
    await request.save();

    const pendingRequestCount = await DonationRequest.countDocuments({
      donation: donation._id,
      requestStatus: "pending",
    });

    if (donation.status === "requested" && pendingRequestCount === 0) {
      donation.status = "available";
      await donation.save();
    }

    await notifyNgoRequestRejected(request, donation, request.adminMessage);

    return successResponse(res, 200, {
      message: "Donation request rejected successfully",
      request,
      donation,
    });
  } catch (err) {
    return next(err);
  }
};
