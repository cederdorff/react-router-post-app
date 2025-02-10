import { Link } from "react-router";
import PostCard from "~/components/PostCard";
import User, { type UserType } from "~/models/User";
import posts from "./posts";
import UserCard from "~/components/UserCard";

export async function loader() {
  const users = await User.find();
  return Response.json({ users });
}

export default function UsersPage({ loaderData }: { loaderData: { users: UserType[] } }) {
  const { users } = loaderData;

  console.log(users);

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
