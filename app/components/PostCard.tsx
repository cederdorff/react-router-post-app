import type { Post } from "~/types";
import ButtonLink from "./ButtonLink";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article
      key={post.id}
      className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img
        src={post.image}
        alt={post.caption}
        className="rounded-t-lg object-cover h-48 w-full"
      />
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {post.caption}
        </h3>
        <ButtonLink href={`/posts/${post.id}`} />
      </div>
    </article>
  );
}
