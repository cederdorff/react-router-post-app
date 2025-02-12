import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import type { PostType } from "~/models/Post";
import Post from "~/models/Post";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/post-update";

export function meta({ data }: { data: { post: PostType } }) {
  return [{ title: `Update: ${data.post.caption}` }];
}

// Server-side loader function
export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  // Load the post
  const post = await Post.findById(params.id);
  if (!post || post.user.toString() !== authUserId) {
    throw redirect(`/posts/${params.id}`);
  }

  return Response.json({ post });
}

// React component
export default function UpdatePostPage({ loaderData }: { loaderData: { post: PostType } }) {
  const { post } = loaderData;

  const [image, setImage] = useState(post.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <main className="page">
      <div className="container">
        <h1>Update Post</h1>
        <Form id="post-form" method="post">
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            defaultValue={post.caption}
            name="caption"
            type="text"
            aria-label="caption"
            placeholder="Write a caption..."
          />
          <label htmlFor="image">Image URL</label>
          <input
            name="image"
            defaultValue={post.image}
            type="url"
            onChange={e => setImage(e.target.value)}
            placeholder="Paste an image URL..."
          />

          <label htmlFor="image-preview">Image Preview</label>
          <img
            id="image-preview"
            className="image-preview"
            src={image || "https://placehold.co/600x400?text=Paste+an+image+URL"}
            alt="Choose"
            onError={e => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "https://placehold.co/600x400?text=Error+loading+image";
            }}
          />

          <div className="btns">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button>Save</button>
          </div>
        </Form>
      </div>
    </main>
  );
}

// Server-side action function
export async function action({ request, params }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  const formData = await request.formData();

  await Post.findByIdAndUpdate(params.id, {
    caption: formData.get("caption"),
    image: formData.get("image")
  });

  return redirect(`/posts/${params.id}`);
}
