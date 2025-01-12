import CardPost from "~/components/PostCard";
import type { Route } from "./+types/posts";
import type { Post } from "~/types";

export async function loader(): Promise<{ posts: Post[] }> {
  const response = await fetch(
    "https://react-router-post-app-default-rtdb.europe-west1.firebasedatabase.app/posts.json"
  );
  const data = await response.json();
  const posts: Post[] = Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  }));

  return { posts };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <main className="container mx-auto px-5">
      <h1 className="text-6xl py-10 text-offWhite">Posts Page</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map(post => (
          <CardPost key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
