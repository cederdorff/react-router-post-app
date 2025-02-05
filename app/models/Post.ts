import { Schema, model, Types, type InferSchemaType } from "mongoose";
import type { UserType } from "./User";

// Define the schema for the Post collection in MongoDB
const postSchema = new Schema(
  {
    caption: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the post (ObjectId pointing to the "User" collection)
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps to each document
);

// Infer TypeScript type for the schema
// `InferSchemaType<typeof postSchema>` extracts the type from the schema definition
// `_id` is manually added because Mongoose doesn't include it in inferred types
// Allow `user` to be either an ObjectId or a populated UserType
export type PostType = InferSchemaType<typeof postSchema> & {
  _id: Types.ObjectId;
  user: UserType; // `user` field can be an ObjectId or a populated user object
};
// Create a Mongoose model for the Post schema
// This model provides an interface to interact with the "Post" collection in MongoDB
const Post = model<PostType>("Post", postSchema);

// Export the Post model for use in other parts of the application
export default Post;
