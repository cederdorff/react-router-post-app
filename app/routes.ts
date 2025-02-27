import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/protected.tsx", [
    index("routes/posts.tsx"),
    route("posts/:id", "routes/post-detail.tsx"),
    route("posts/:id/update", "routes/post-update.tsx"),
    route("add-post", "routes/post-add.tsx"),
    route("/users", "routes/users.tsx"),
    route("/profile", "routes/profile.tsx")
  ]),
  route("posts/:id/destroy", "routes/post-destroy.ts"),
  route("/signin", "routes/signin.tsx"),
  route("/auth/github/callback", "routes/auth/github-callback.ts"),
  route("/auth/github", "routes/auth/github.ts"),
  route("/auth/signout", "routes/auth/signout.ts")
] satisfies RouteConfig;
