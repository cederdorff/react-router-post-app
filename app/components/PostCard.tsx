import UserAvatar from "./UserAvatar";
import type { PostType } from "~/models/Post";

export default function PostCard({ post }: { post: PostType }) {
  return (
    <article className="post-card">
      <UserAvatar user={post.user} />
      <img src={post.image} alt={post.caption} />
      <h3>{post.caption}</h3>
      <p>Likes: {post.likes}</p>
      <p>Tags: {post.tags.join(", ")}</p>
    </article>
  );
}
