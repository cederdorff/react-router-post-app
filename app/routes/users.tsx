import { redirect } from "react-router";
import UserCard from "~/components/UserCard";
import User, { type UserType } from "~/models/User";
import type { Route } from "./+types/users";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (!user) {
    throw redirect("/signin");
  }

  const users = await User.find();
  return Response.json({ users });
}

export default function UsersPage({ loaderData }: { loaderData: { users: UserType[] } }) {
  const { users } = loaderData;

  return (
    <main className="page">
      <section className="grid">
        {users.map(user => (
          <UserCard key={user._id.toString()} user={user} />
        ))}
      </section>
    </main>
  );
}
