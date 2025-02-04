import type { Route } from "./+types/posts";
import { Welcome } from "../welcome/welcome";
import Post from "~/models/Post";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Post App 🚀" },
    { name: "description", content: "Welcome to my React Router Post App" }
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const posts = await Post.find().populate("user").sort({ createdAt: -1 }).lean();

  return { posts };
}

export default function PostsPage({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  console.log(posts);

  return <Welcome />;
}
