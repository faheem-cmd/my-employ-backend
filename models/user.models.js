const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "", required: true },
    phone: { type: String, default: "", required: true },
    password: { type: String, required: true },
    access_token: { type: String, default: "" },
    // refresh_token: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
