import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: String,
    mail: {
      type: String,
      required: true, // Ensure user emails are required
      unique: true // Ensure user emails are unique
    },
    name: String,
    title: String,
    educations: [String]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Create a User model from the userSchema

export default User; // Export the User model
