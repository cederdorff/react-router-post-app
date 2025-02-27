import { redirect } from "react-router";
import Post from "~/models/Post";
import type { Route } from "./+types/post-destroy";
import { authenticateUser } from "~/services/auth.server";

// Server-side action
export async function action({ params, request }: Route.ActionArgs) {
  await authenticateUser(request);

  await Post.findByIdAndDelete(params.id);
  return redirect("/");
}
