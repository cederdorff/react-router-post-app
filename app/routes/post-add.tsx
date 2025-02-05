import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import Post from "~/models/Post";
import type { Route } from "./+types/post-add";

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
    <main className="page">
      <div className="container">
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // Extract and typecast values correctly
  const caption = formData.get("caption");
  const image = formData.get("image");
  const user = "65cde4cb0d09cb615a23db17"; // RACE._id (hardcoded) - Should ideally come from authentication context

  // Create the post and ensure it's awaited
  await Post.create({
    caption,
    image,
    user
  });

  return redirect("/");
}
