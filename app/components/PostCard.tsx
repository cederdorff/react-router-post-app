import type { Post } from "~/types";
import ButtonLink from "./ButtonLink";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article key={post.id} className="bg-offWhite rounded-lg shadow-lg">
      <img
        src={post.image}
        alt={post.caption}
        className="rounded-t-lg object-cover h-48 w-full"
      />
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold text-darkTeal">{post.caption}</h3>
        <ButtonLink href={`/posts/${post.id}`} />
      </div>
    </article>
  );
}
