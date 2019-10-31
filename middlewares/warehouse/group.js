const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/group");
const groupModel = mongoose.model("Group");

const addGroup = async ({ body }, res) => {
  const { groupName, parentGroup, user } = body;
  if (user.role < 2) {
    const group = {
      groupName
    };
    if (parentGroup) {
      group.parentGroup = parentGroup;
    }

    await new groupModel(group).save();
    res.status(200).json({ payload: group, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateGroup = async ({ body }, res) => {
  const { groupName, parentGroup, id, user } = body;
  if (user.role < 2) {
    const group = groupModel.findById(id);
    group.groupName = groupName;

    if (parentGroup) {
      group.parentGroup = parentGroup;
    }

    await group.save();
    res.status(200).json({ payload: group, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const deleteGroup = async ({ body }, res) => {
  const { id, user } = body;
  if (user.role < 2) {
    const group = groupModel.findByIdAndDelete(id);
    if (group) {
      res.status(200).json({ payload: group, msg: "success" });
    } else {
      res.status(200).json({ err: "group not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

module.exports = {
  addGroup,
  updateGroup,
  deleteGroup
};
