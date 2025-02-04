import type { Route } from "./+types/posts";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Post App 🚀" },
    { name: "description", content: "Welcome to my React Router Post App" }
  ];
}

export default function PostsPage() {
  return <Welcome />;
}
