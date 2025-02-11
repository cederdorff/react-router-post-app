import UserCard from "~/components/UserCard";
import User, { type UserType } from "~/models/User";

export async function loader() {
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
