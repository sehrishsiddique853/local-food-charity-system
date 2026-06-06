import Donation from "../models/Donation.js";
import DonationRequest from "../models/DonationRequest.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  notifyDonationCollected,
  notifyDonationExpired,
  notifyDonationRequested,
} from "../services/notificationService.js";

const DAILY_REQUEST_LIMIT = 5;
const NGO_CANCELLED_MESSAGE = "Cancelled by NGO";

const markExpiredDonations = async () => {
  const filter = {
    status: { $in: ["available", "requested"] },
    expiryDate: { $lte: new Date() },
    isActive: true,
  };

  const expiringDonations = await Donation.find(filter).select("_id donor foodTitle");

  await Donation.updateMany(filter, {
    $set: {
      status: "expired",
      isActive: false,
    },
  });

  await Promise.all(expiringDonations.map((donation) => notifyDonationExpired(donation)));
};

const ensureDonationCanBeRequested = (donation) => {
  if (!donation) {
    throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
  }

  if (!donation.isActive || donation.status === "expired" || donation.expiryDate <= new Date()) {
    throw new ApiError(400, "DONATION_EXPIRED", "Donation has expired");
  }

  if (!["available", "requested"].includes(donation.status)) {
    throw new ApiError(400, "DONATION_NOT_AVAILABLE", "Donation is not available for request");
  }
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

export const getAvailableDonations = async (req, res, next) => {
  try {
    await markExpiredDonations();

    const { search, foodType } = req.query;
    const activeRequestDonationIds = await DonationRequest.distinct("donation", {
      ngo: req.user.id,
      requestStatus: { $in: ["pending", "approved"] },
    });

    const filter = {
      _id: { $nin: activeRequestDonationIds },
      status: { $in: ["available", "requested"] },
      isActive: true,
      expiryDate: { $gt: new Date() },
    };

    if (foodType) {
      filter.foodType = foodType;
    }

    if (search) {
      filter.foodTitle = { $regex: search, $options: "i" };
    }

    const donations = await Donation.find(filter)
      .populate("donor", "name phone location")
      .sort({ createdAt: -1 });

    const visibleDonations = donations.map((donation) => ({
      ...donation.toObject(),
      status: "available",
    }));

    return successResponse(res, 200, { donations: visibleDonations });
  } catch (err) {
    return next(err);
  }
};

export const requestDonation = async (req, res, next) => {
  try {
    await markExpiredDonations();

    const donation = await Donation.findById(req.params.id);
    ensureDonationCanBeRequested(donation);

    const activeRequest = await DonationRequest.findOne({
      donation: donation._id,
      ngo: req.user.id,
      requestStatus: { $in: ["pending", "approved"] },
    });

    if (activeRequest) {
      throw new ApiError(409, "REQUEST_ALREADY_EXISTS", "You already requested this donation");
    }

    const { start, end } = getTodayRange();
    const todayRequestCount = await DonationRequest.countDocuments({
      ngo: req.user.id,
      createdAt: { $gte: start, $lt: end },
      requestStatus: { $in: ["pending", "approved"] },
    });

    if (todayRequestCount >= DAILY_REQUEST_LIMIT) {
      throw new ApiError(
        400,
        "DAILY_REQUEST_LIMIT_REACHED",
        `NGOs can request only ${DAILY_REQUEST_LIMIT} donations per day`
      );
    }

    const request = await DonationRequest.create({
      donation: donation._id,
      ngo: req.user.id,
      requestStatus: "pending",
      pickupTime: req.body.pickupTime,
    });

    await notifyDonationRequested(donation, request);

    return successResponse(res, 201, {
      message: "Donation request sent successfully",
      request,
    });
  } catch (err) {
    return next(err);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    await markExpiredDonations();

    const requests = await DonationRequest.find({
      ngo: req.user.id,
      requestStatus: { $in: ["pending", "approved"] },
    })
      .populate("donation")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { requests });
  } catch (err) {
    return next(err);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id).populate("donation");

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Request not found");
    }

    if (request.ngo.toString() !== req.user.id.toString()) {
      throw new ApiError(403, "FORBIDDEN", "You can only view your own requests");
    }

    return successResponse(res, 200, { request });
  } catch (err) {
    return next(err);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      throw new ApiError(404, "REQUEST_NOT_FOUND", "Request not found");
    }

    if (request.ngo.toString() !== req.user.id.toString()) {
      throw new ApiError(403, "FORBIDDEN", "You can only cancel your own requests");
    }

    if (request.requestStatus !== "pending") {
      throw new ApiError(400, "REQUEST_NOT_CANCELABLE", "Only pending requests can be cancelled");
    }

    request.requestStatus = "cancelled";
    request.adminMessage = NGO_CANCELLED_MESSAGE;
    await request.save();

    return successResponse(res, 200, {
      message: "Request cancelled successfully",
      request,
    });
  } catch (err) {
    return next(err);
  }
};

export const getRequestStats = async (req, res, next) => {
  try {
    const groupedStats = await DonationRequest.aggregate([
      {
        $match: {
          ngo: req.user.id,
          requestStatus: { $in: ["pending", "approved", "collected", "cancelled"] },
        },
      },
      {
        $group: {
          _id: "$requestStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      collected: 0,
      cancelled: 0,
    };

    groupedStats.forEach((item) => {
      stats[item._id] = item.count;
      stats.totalRequests += item.count;
    });

    return successResponse(res, 200, stats);
  } catch (err) {
    return next(err);
  }
};

export const getBookedDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({
      bookedByNgo: req.user.id,
      status: "booked",
      isActive: true,
    })
      .populate("donor", "name email phone location")
      .sort({ updatedAt: -1 });

    return successResponse(res, 200, { donations });
  } catch (err) {
    return next(err);
  }
};

export const markDonationCollected = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }

    if (donation.status !== "booked" || donation.bookedByNgo?.toString() !== req.user.id.toString()) {
      throw new ApiError(
        400,
        "DONATION_NOT_COLLECTABLE",
        "Only donations booked for your NGO can be marked collected"
      );
    }

    donation.status = "collected";
    await donation.save();

    await DonationRequest.findOneAndUpdate(
      {
        donation: donation._id,
        ngo: req.user.id,
        requestStatus: "approved",
      },
      { $set: { requestStatus: "collected" } }
    );

    await notifyDonationCollected(donation);

    return successResponse(res, 200, {
      message: "Donation marked as collected",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const getNgoHistory = async (req, res, next) => {
  try {
    const [requests, donations] = await Promise.all([
      DonationRequest.find({
        ngo: req.user.id,
        requestStatus: { $in: ["rejected", "collected"] },
        $or: [
          { requestStatus: { $ne: "rejected" } },
          { adminMessage: { $ne: NGO_CANCELLED_MESSAGE } },
        ],
      })
        .populate("donation")
        .sort({ createdAt: -1 }),
      Donation.find({
        bookedByNgo: req.user.id,
        status: { $in: ["collected", "completed"] },
      }).sort({ updatedAt: -1 }),
    ]);

    return successResponse(res, 200, {
      requests,
      donations,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    await markExpiredDonations();
    const donation = await Donation.findById(req.params.id).populate("donor", "name phone location");
    if (!donation) {
      throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
    }
    return successResponse(res, 200, { donation });
  } catch (err) {
    return next(err);
  } 

};
