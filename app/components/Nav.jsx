import { NavLink } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/posts">Posts</NavLink>
      <NavLink to="/add-post">Add Post</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
}
