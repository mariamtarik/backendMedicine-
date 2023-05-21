const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required:true
    },
    dosage: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    jobId: {
      type: String
    },

  },
  {
    timestamps: true,
  }
);

const medicineModel = mongoose.model("Medicine", medicineSchema);
module.exports = medicineModel;
