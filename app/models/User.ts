import { Schema, Types, model, type InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

// Define the schema for the User collection in MongoDB
const userSchema = new Schema(
  {
    image: {
      type: String
    },
    mail: {
      type: String,
      required: true,
      unique: true // Enforce uniqueness to avoid duplicate emails
    },
    name: {
      type: String,
      required: true
    },
    title: String,
    educations: [String],
    password: {
      type: String,
      required: true, // Ensure user passwords are required
      select: false // Automatically exclude from query results
    }
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps to each document
);

// pre save password hook
userSchema.pre("save", async function (next) {
  const user = this; // this refers to the user document

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next(); // continue
  }

  const salt = await bcrypt.genSalt(10); // generate a salt
  user.password = await bcrypt.hash(user.password, salt); // hash the password
  next(); // continue
});

// Infer TypeScript type for the schema
// `InferSchemaType<typeof userSchema>` generates the type based on the schema definition
export type UserType = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

// Create a Mongoose model for the User schema
// This model provides an interface to interact with the "User" collection in MongoDB
const User = model<UserType>("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
