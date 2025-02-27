import { redirect } from "react-router";
import type { Route } from "./+types/signout";
import { sessionStorage } from "~/services/session.server";

export async function action({ request }: Route.ActionArgs) {
  // Get the session
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  // Destroy the session and redirect to the signin page
  return redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) }
  });
}
