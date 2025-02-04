import { Link } from "react-router";
import Post, { type PostType } from "~/models/Post";
import type { Route } from "./+types/posts";
import PostCard from "~/components/PostCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Post App 🚀" },
    { name: "description", content: "Welcome to my React Router Post App" }
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const posts: PostType[] = await Post.find().populate("user").lean(); // Use .lean() to return plain JavaScript objects

  return { posts };
}

export default function PostsPage({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  console.log(posts);

  return (
    <section className="grid">
      {posts.map(post => (
        <Link key={post._id.toString()} className="post-link" to={`${post._id.toString()}`}>
          <PostCard post={post} />
        </Link>
      ))}
    </section>
  );
}
