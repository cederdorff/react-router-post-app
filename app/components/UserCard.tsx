import type { UserType } from "~/models/User";

export default function UserCard({ user }: { user: UserType }) {
  return (
    <article className="post-card">
      <img src={user.image || "https://placehold.co/100"} alt={user.name || "User name"} />
      <h3>{user.name}</h3>
      <p>{user.title}</p>
    </article>
  );
}
