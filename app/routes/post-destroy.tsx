import { redirect } from "react-router";
import Post from "~/models/Post";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/post-destroy";

// Server-side action
export async function action({ params, request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  await Post.findByIdAndDelete(params.id);
  return redirect("/");
}
