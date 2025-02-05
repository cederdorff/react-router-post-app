import { useState } from "react";
import { useLoaderData, useNavigate, Form, redirect } from "react-router";
import type { PostType } from "~/models/Post";
import Post from "~/models/Post";
import type { Route } from "./+types/post-update";

export function meta({ data }: { data: { post: PostType } }) {
  return [{ title: `Update: ${data.post.caption}` }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const post = Post.findById(params.id).populate("user");
  return Response.json({ post });
}

export default function UpdatePostPage() {
  const { post } = useLoaderData();
  const [image, setImage] = useState(post.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
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

        <input name="uid" type="text" defaultValue={post.uid} hidden />
        <div className="btns">
          <button>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  Post.findByIdAndUpdate(params.id, {
    caption: formData.get("caption"),
    image: formData.get("image")
  });

  return redirect(`/posts/${params.postId}`);
}
