import type { Route } from "./+types/posts-detail";
import type { Post } from "../types";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `https://react-router-post-app-default-rtdb.europe-west1.firebasedatabase.app/posts/${params.id}.json`
  );
  const post: Post = await response.json();

  return { post };
}

export default function PostDetail({ loaderData }: { loaderData: { post: Post } }) {
  const { post } = loaderData;
  return (
    <main className="container mx-auto">
      <h1 className="text-6xl py-10">{post.caption}</h1>
      <img src={post.image} alt={post.caption} className="w-full rounded-lg" />
      <p className="py-5 text-xl">{new Date(post.createdAt).toLocaleString()}</p>
    </main>
  );
}
