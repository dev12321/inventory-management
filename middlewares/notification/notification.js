const mongoose = require("mongoose");
require("../../models/notification");
const notificationModel = mongoose.model("Notification");

const getTopNotifications = async (req, res) => {
  // console.log(req);
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const notifications = await notificationModel
    .find()
    .skip(offset)
    .limit(limit);
  if (notifications.length > 0)
    res.status(200).json({ payload: notifications, message: "success" });
  else res.status(200).json({ payload: [], message: "No Documents Found" });
};

const getAllNotifications = async (req, res) => {
  // console.log(req);
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const notifications = await notificationModel
    .find()
    .skip(offset)
    .limit(limit);
  if (notifications.length > 0)
    res.status(200).json({ payload: notifications, message: "success" });
  else res.status(200).json({ payload: [], message: "No Documents Found" });
};
const readNotification = async ({ body }, res) => {
  // console.log(req);
  const { id } = body;
  const notification = await notificationModel.findById(id);
  if (notification) {
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ payload: notification, message: "success" });
  } else res.status(200).json({ err: "No such notification found" });
};
const deleteNotification = async ({ body }, res) => {
  const { id } = body;
  const notification = await notificationModel.findByIdAndRemove(id);
  if (notification) {
    res.status(200).json({ payload: notification, message: "success" });
  } else res.status(200).json({ err: "No such notification found" });
};

module.exports = {
  getAllNotifications,
  getTopNotifications,
  readNotification,
  deleteNotification
};
