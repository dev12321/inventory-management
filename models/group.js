const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: mongoose.SchemaTypes.String,
    unique: true,
    required: [true, "GroupName is Required"]
  },
  parentGroup: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Group"
  }
});

GroupSchema.plugin(uniqueValidator, { message: "is already taken." });

mongoose.model("Group", GroupSchema);
