const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const BabySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    birthOfDate: {
      type: Date,
      default: Date.now,
    },
    seq: {
      type: Number,
      required: true,
    },
    initWeight: {
      type: Number,
    },
    initHeight: {
      type: Number,
    },
    isPremature: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = Baby = mongoose.model("babies", BabySchema);
