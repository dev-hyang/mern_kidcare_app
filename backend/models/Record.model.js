const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = Record = mongoose.model("records", RecordSchema);
