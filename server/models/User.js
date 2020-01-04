const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, min: 4 },
    role: { type: String, default: "subscriber" },
    resetPasswordLink: { data: String, default: "" },
    googleId: { type: String }
  },
  { timestamps: true }
);

module.exports = model("user", userSchema);
