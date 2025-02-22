import type { UserType } from "~/models/User";

export default function UserAvatar({ user }: { user: UserType }) {
  return (
    <div className="avatar">
      <img src={user.image || "https://placehold.co/100"} alt={user.name || "User name"} />
      <span>
        <h3>{user.name}</h3>
        <p>{user.title}</p>
      </span>
    </div>
  );
}
