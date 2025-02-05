import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/posts.tsx"),
  route("posts/:id", "routes/post-detail.tsx"),
  route("add-post", "routes/add-post.tsx")
] satisfies RouteConfig;
