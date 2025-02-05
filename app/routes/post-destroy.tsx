import Post from "~/models/Post";
import type { Route } from "./+types/post-destroy";
import { redirect } from "react-router";

// Server-side action
export async function action({ params }: Route.ActionArgs) {
  await Post.findByIdAndDelete(params.id);
  return redirect("/");
}
