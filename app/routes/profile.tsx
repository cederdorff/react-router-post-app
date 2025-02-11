import { Form, redirect } from "react-router";
import User, { type UserType } from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }
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
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) }
  });
}
