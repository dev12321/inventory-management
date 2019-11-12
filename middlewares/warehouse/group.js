const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/notification");
require("../../models/group");
const groupModel = mongoose.model("Group");
const notificationModel = mongoose.model("Notification");

const addGroup = async ({ body, user }, res) => {
  const { groupName, parentGroup } = body;
  if (user.role > 0) {
    const group = {
      groupName
    };
    if (parentGroup) {
      group.parentGroup = parentGroup;
    }

    await new groupModel(group).save();
    const notification = {
      title: `New Group Added`,
      body: `A new group with the name '${groupName}' is added.`,
      isRead: false,
      accessLevel: 0
    };
    await new notificationModel(notification).save();
    res.status(200).json({ payload: group, message: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateGroup = async ({ body, user }, res) => {
  const { groupName, parentGroup, id } = body;
  if (user.role > 0) {
    const group = groupModel.findById(id);
    group.groupName = groupName;

    if (parentGroup) {
      group.parentGroup = parentGroup;
    }

    const notification = {
      title: `Group Detail Updated`,
      body: `The group with the name '${groupName}' is updated.`,
      isRead: false,
      accessLevel: 0
    };
    await new notificationModel(notification).save();

    await group.save();
    res.status(200).json({ payload: group, message: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const deleteGroup = async ({ body, user }, res) => {
  const { id } = body;
  if (user.role > 0) {
    const group = groupModel.findByIdAndDelete(id);
    if (group) {
      const notification = {
        title: `Group Deleted`,
        body: `The group with the name '${groupName}' is deleted.`,
        isRead: false,
        accessLevel: 0
      };
      await new notificationModel(notification).save();
      res.status(200).json({ payload: group, message: "success" });
    } else {
      res.status(200).json({ err: "group not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const getGroups = async ({ user }, res) => {
  if (user.role > 0) {
    const groups = await groupModel.find();
    if (groups.length > 0)
      res.status(200).json({ payload: groups, message: "success" });
    else res.status(200).json({ err: "No Documents Found" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

module.exports = {
  addGroup,
  updateGroup,
  deleteGroup,
  getGroups
};
