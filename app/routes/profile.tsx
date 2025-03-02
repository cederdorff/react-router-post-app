import { Form } from "react-router";
import User, { type UserType } from "~/models/User";
import { authenticateUser } from "~/services/auth.server";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const authUser = await authenticateUser(request);
  const user = await User.findById(authUser._id);
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
      <Form method="post" action="/auth/signout">
        <div className="btns full">
          <button>Sign Out</button>
        </div>
      </Form>
    </div>
  );
}
