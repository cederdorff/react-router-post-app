import { Form, redirect } from "react-router";
import User, { type UserType } from "~/models/User";
import { authenticateUser } from "~/services/auth.server";
import type { Route } from "./+types/profile";
import { useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const authUser = await authenticateUser(request);
  const user = await User.findById(authUser._id);
  return Response.json({ user });
}

export default function Profile({ loaderData }: { loaderData: { user: UserType } }) {
  const { user } = loaderData;
  const [image, setImage] = useState(user.image || "https://placehold.co/600x400?text=Add+your+amazing+image");

  return (
    <div className="page">
      <h1>Profile</h1>

      <Form id="profile-form" method="post">
        <label htmlFor="caption">Name</label>
        <input
          defaultValue={user.name || ""}
          name="name"
          type="text"
          aria-label="name"
          placeholder="Type your name..."
        />
        <label htmlFor="caption">Title</label>
        <input
          defaultValue={user.title || ""}
          name="title"
          type="text"
          aria-label="title"
          placeholder="Type your title..."
        />
        <label htmlFor="caption">Mail</label>
        <input
          defaultValue={user.mail || ""}
          name="mail"
          type="email"
          aria-label="email"
          placeholder="Type your email..."
        />
        <label htmlFor="image">Profile Image</label>
        <input
          name="image"
          defaultValue={user.image || ""}
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
          <button>Save</button>
        </div>
      </Form>

      <Form method="post" action="/auth/signout">
        <div className="btns full">
          <button className="btn-cancel">Sign Out</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const authUser = await authenticateUser(request);

  // Get the form data
  const formData = await request.formData();

  await User.findByIdAndUpdate(authUser._id, {
    name: formData.get("name"),
    title: formData.get("title"),
    mail: formData.get("mail"),
    image: formData.get("image")
  });
  return redirect("/profile");
}
