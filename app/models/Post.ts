import { Schema, model, Types, type InferSchemaType } from "mongoose";

// Define the schema
const postSchema = new Schema(
  {
    caption: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true }, // Reference to User model
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Infer the type and extend it with `_id`
export type PostType = InferSchemaType<typeof postSchema> & { _id: Types.ObjectId };

// Create the model
const Post = model<PostType>("Post", postSchema);

export default Post;
