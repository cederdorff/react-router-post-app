import Post from "~/models/Post";
import type { Route } from "./+types/post-destroy";
import { redirect } from "react-router";
import { sessionStorage } from "~/services/session.server";

// Server-side action
export async function action({ params, request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (!user) {
    throw redirect("/signin");
  }

  await Post.findByIdAndDelete(params.id);
  return redirect("/");
}
