const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    medicineTimings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
    }],
    socketId: {
      type: String,
      default: null,
    },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUD);
  }
  next()
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
