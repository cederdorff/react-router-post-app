import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/posts.tsx"),
  route("posts/:id", "routes/post-detail.tsx"),
  route("posts/:id/update", "routes/post-update.tsx"),
  route("posts/:id/destroy", "routes/post-destroy.tsx"),
  route("add-post", "routes/post-add.tsx"),
  route("/users", "routes/users.tsx"),
  route("/signin", "routes/signin.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/profile", "routes/profile.tsx")
] satisfies RouteConfig;
