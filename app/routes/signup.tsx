import { data, Form, NavLink, redirect } from "react-router";
import User from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/signup";

// We need to export a loader function to check if the user is already
// authenticated and redirect them to the dashboard
export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (authUserId) {
    throw redirect("/");
  }
  return data(null);
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  return (
    <div id="sign-up-page" className="page">
      <h1>Sign Up</h1>
      <Form id="sign-up-form" method="post">
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
          required
          autoComplete="off"
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          name="password"
          aria-label="password"
          placeholder="Type your password..."
          autoComplete="current-password"
        />
        <div className="btns">
          <button>Sign Up</button>
        </div>

        {actionData?.error ? (
          <div className="error-message">
            <p>{actionData?.error}</p>
          </div>
        ) : null}
      </Form>
      <p>
        Already have an account? <NavLink to="/signin">Sign in here.</NavLink>
      </p>
    </div>
  );
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData(); // get the form data
    const newUser = Object.fromEntries(formData); // convert the form data to an object
    await User.create(newUser); // create the user

    return redirect("/signin"); // redirect to the sign-in page
  } catch (error) {
    if (error instanceof Error) {
      // here the error related to the authentication process
      return data({ error: error.message });
    }
  }
}
