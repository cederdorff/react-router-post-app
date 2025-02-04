import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: String,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    likes: Number,
    tags: [String]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
