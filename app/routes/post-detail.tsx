import mongoose from "mongoose";
import { Form } from "react-router";
import type { PostType } from "~/models/Post";
import PostCard from "../components/PostCard";
import type { Route } from "./+types/post-detail";

export function meta({ data }: { data: { post: PostType } }) {
  return [{ title: data.post.caption }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  // Load the post and the user who created it
  const post = await mongoose.models.Post.findById(params.id).populate("user");
  return Response.json({ post });
}

export default function Post({ loaderData }: { loaderData: { post: PostType } }) {
  const { post } = loaderData;

  return (
    <div id="post-page" className="page">
      <h1>{post.caption}</h1>
      {/* Render the PostCard with the post details */}
      <PostCard post={post} />

      <div className="btns">
        {/* Form to update the post */}
        <Form action="update">
          <button type="submit">Update</button>
        </Form>

        {/* Form to delete the post */}
        <Form action="destroy" method="post">
          <button type="submit">Delete</button>
        </Form>
      </div>
    </div>
  );
}
