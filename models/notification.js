const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the Title"]
    },
    body: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the body"]
    },
    isRead: {
      type: mongoose.SchemaTypes.Boolean,
      required: true
    },
    accessLevel: {
      type: mongoose.SchemaTypes.Number
    }
  },
  { timestamps: true }
);

NotificationSchema.plugin(uniqueValidator, { message: "is already taken." });

mongoose.model("Notification", NotificationSchema);
