import type { User } from "~/types";

interface UserAvatarProps {
  user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="flex items-center space-x-2">
      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
      <div>
        <h4 className="text-sm font-semibold text-darkTeal">{user.name}</h4>
        <p className="text-xs text-offWhite">{user.title}</p>
      </div>
    </div>
  );
}
