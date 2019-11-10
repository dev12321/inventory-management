const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/group");
const groupModel = mongoose.model("Group");

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
