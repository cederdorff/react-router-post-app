import mongoose from "mongoose";
import { useState } from "react";
import { useNavigate, Form, redirect } from "react-router";
import type { Route } from "./+types/add-post";
import type { PostType } from "~/models/Post";
import Post from "~/models/Post";

export const meta = () => {
  return [{ title: "Remix Post App - Add New Post" }];
};

export default function AddPostPage() {
  const [image, setImage] = useState("https://placehold.co/600x400?text=Add+your+amazing+image");
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Add a Post</h1>
      <Form id="post-form" method="post">
        <label htmlFor="caption">Caption</label>
        <input id="caption" name="caption" type="text" aria-label="caption" placeholder="Write a caption..." />

        <label htmlFor="image">Image URL</label>
        <input name="image" type="url" onChange={e => setImage(e.target.value)} placeholder="Paste an image URL..." />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/600x400?text=Error+loading+image";
          }}
        />

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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // Extract and typecast values correctly
  const caption = formData.get("caption") as string | null;
  const image = formData.get("image") as string | null;
  const user = "67a2392d97a9919cc4e1fe45"; // Should ideally come from authentication context

  if (!caption || !image) {
    throw new Response("Caption and Image are required", { status: 400 });
  }

  // Create the post and ensure it's awaited
  await Post.create({
    caption,
    image,
    user
  });

  return redirect("/");
}
