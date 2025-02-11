import { data, Link, redirect } from "react-router";
import PostCard from "~/components/PostCard";
import Post, { type PostType } from "~/models/Post";
import type { Route } from "./+types/posts";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (!user) {
    throw redirect("/signin");
  }

  const posts = await Post.find().populate("user");
  return Response.json({ posts });
}

export default function PostsPage({ loaderData }: { loaderData: { posts: PostType[] } }) {
  const { posts } = loaderData;
  console.log(posts);

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
