import { NavLink } from "react-router";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Posts</NavLink>
      <NavLink to="/add-post">Add Post</NavLink>
      <NavLink to="/users">Users</NavLink>
    </nav>
  );
}
