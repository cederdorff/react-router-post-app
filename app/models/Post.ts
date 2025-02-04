import mongoose from "mongoose";

export interface PostType {
  _id: mongoose.Schema.Types.ObjectId;
  caption: string;
  image: string;
  user: mongoose.Schema.Types.ObjectId | any; // Can be ObjectId or populated User
  likes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostType>(
  {
    caption: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Post = mongoose.model<PostType>("Post", postSchema);
export default Post;
