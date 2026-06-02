import Notification from "../models/Notification.js";
import { successResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/ApiError.js";

const getUserNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    receiver: userId,
  });

  if (!notification) {
    throw new ApiError(404, "NOTIFICATION_NOT_FOUND", "Notification not found");
  }

  return notification;
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, 200, { notifications });
  } catch (err) {
    return next(err);
  }
};

export const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    return successResponse(res, 200, { unreadCount });
  } catch (err) {
    return next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await getUserNotification(req.params.id, req.user.id);
    notification.isRead = true;
    await notification.save();

    return successResponse(res, 200, {
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    return next(err);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return successResponse(res, 200, {
      message: "All notifications marked as read",
    });
  } catch (err) {
    return next(err);
  }
};
