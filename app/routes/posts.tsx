import { Link } from "react-router";
import PostCard from "~/components/PostCard";
import Post, { type PostType } from "~/models/Post";
import type { Route } from "./+types/posts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Post App 🚀" },
    { name: "description", content: "Welcome to my React Router Post App" }
  ];
}

export async function loader() {
  const posts: PostType[] = await Post.find().populate("user");
  return Response.json({ posts });
}

export default function PostsPage({ loaderData }: { loaderData: { posts: PostType[] } }) {
  const { posts } = loaderData;

  return (
    <main className="page">
      <section className="grid">
        {posts.map(post => (
          <Link key={post._id.toString()} className="post-link" to={`/posts/${post._id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </section>
    </main>
  );
}
