import { redirect } from "react-router";
import Post from "~/models/Post";
import { authenticate } from "~/services/auth.server";
import type { Route } from "./+types/post-destroy";

// Server-side action
export async function action({ params, request }: Route.ActionArgs) {
  await authenticate(request);

  await Post.findByIdAndDelete(params.id);
  return redirect("/");
}
