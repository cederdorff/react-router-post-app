import type { Route } from "./+types/posts-detail";

export async function loader({ params }: Route.LoaderArgs) {
  return { id: params.id };
}

export default function PostUpdate({ params }: Route.ComponentProps) {
  return <h1>Post to Upddate: {params.id}</h1>;
}
