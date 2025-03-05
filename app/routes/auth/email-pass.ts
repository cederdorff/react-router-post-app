import { data, redirect } from "react-router";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/email-pass";

// We need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: Route.ActionArgs) {
  let authUser = await authenticator.authenticate("email-pass", request);
  if (!authUser) {
    return redirect("/signin");
  }

  try {
    const session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.set("authUser", authUser);
    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) }
    });
  } catch (error) {
    if (error instanceof Error) {
      // here the error related to the authentication process
      return data({ error: error.message });
    }
  }
}
