import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/posts.tsx"),
  route("posts/add", "routes/posts-add.tsx"),
  route("posts/:id", "routes/posts-detail.tsx"),
  route("posts/:id/update", "routes/posts-update.tsx")
] satisfies RouteConfig;
