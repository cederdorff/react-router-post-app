import { Form, redirect } from "react-router";
import Post, { type PostType } from "~/models/Post";
import { sessionStorage } from "~/services/session.server";
import PostCard from "../components/PostCard";
import type { Route } from "./+types/post-detail";

export function meta({ data }: { data: { post: PostType } }) {
  return [{ title: data.post.caption }];
}

// Server-side loader function
export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  // Load the post and the user who created it
  const post = await Post.findById(params.id).populate("user");
  return Response.json({ post }); // Return the post and user data
}

// React component
export default function PostDetailPage({ loaderData }: { loaderData: { post: PostType } }) {
  const { post } = loaderData;

  function confirmDelete(event: React.FormEvent) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <main className="page" id="post-page">
      <div className="container">
        <h1>{post.caption}</h1>
        {/* Render the PostCard with the post details */}
        <PostCard post={post} />

        <div className="btns">
          {/* Form to delete the post */}
          <Form action="destroy" method="post" onSubmit={confirmDelete}>
            <button type="submit">Delete</button>
          </Form>
          {/* Form to update the post */}
          <Form action="update">
            <button type="submit">Update</button>
          </Form>
        </div>
      </div>
    </main>
  );
}
