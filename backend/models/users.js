const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    notificationsEnabled: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
