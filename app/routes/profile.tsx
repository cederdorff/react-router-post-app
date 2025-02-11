import { Form, redirect } from "react-router";
import User, { type UserType } from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/profile";
import { authenticate } from "~/services/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const authUserId = await authenticate(request);
  const user = await User.findById(authUserId).lean();
  return Response.json({ user });
}

export default function Profile({ loaderData }: { loaderData: { user: UserType } }) {
  const { user } = loaderData;

  return (
    <div className="page">
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Title: {user.title}</p>
      <p>Mail: {user.mail}</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}

export async function action({ request }: Route.ActionArgs) {
  // Get the session
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  // Destroy the session and redirect to the signin page
  return redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) }
  });
}
