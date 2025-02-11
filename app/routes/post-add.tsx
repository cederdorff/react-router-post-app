import { useState } from "react";
import { data, Form, redirect, useNavigate } from "react-router";
import Post from "~/models/Post";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/post-add";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }
}
// React component
export default function AddPostPage({ actionData }: Route.ComponentProps) {
  const [image, setImage] = useState("https://placehold.co/600x400?text=Add+your+amazing+image");
  const navigate = useNavigate();

  console.log(actionData);

  function handleCancel() {
    navigate(-1);
  }

  return (
    <main className="page">
      <div className="container">
        <h1>Add a Post</h1>
        <Form id="post-form" method="post">
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            name="caption"
            type="text"
            aria-label="caption"
            placeholder="Write a caption..."
            className={actionData?.errors?.caption ? "error" : ""}
          />
          {actionData?.errors?.caption && (
            <div className="error-message">
              <p>{actionData?.errors?.caption.message}</p>
            </div>
          )}

          <label htmlFor="image">Image URL</label>
          <input
            name="image"
            type="url"
            onChange={e => setImage(e.target.value)}
            placeholder="Paste an image URL..."
            className={actionData?.errors?.image ? "error" : ""}
          />
          {actionData?.errors?.caption && (
            <div className="error-message">
              <p>{actionData?.errors?.caption.message}</p>
            </div>
          )}

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

// Server-side action
export async function action({ request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  const formData = await request.formData();

  // Extract and typecast values correctly
  const caption = formData.get("caption");
  const image = formData.get("image");

  try {
    // Create the post and ensure it's awaited
    await Post.create({
      caption,
      image,
      user: authUserId
    });

    return redirect("/");
  } catch (error) {
    return data({ errors: error.errors });
  }
}
