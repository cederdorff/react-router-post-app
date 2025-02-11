import { data, Form, NavLink, redirect } from "react-router";
import User from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/signup";

// We need to export a loader function to check if the user is already
// authenticated and redirect them to the dashboard
export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (user) {
    throw redirect("/");
  }
  return data(null);
}

export default function SignUp() {
  // // if i got an error it will come back with the loader data
  // const loaderData = useLoaderData();
  // console.log("error:", loaderData?.error);

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

        {/* {loaderData?.error ? (
          <div className="error-message">
            <p>{loaderData?.error?.message}</p>
          </div>
        ) : null} */}
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
    console.log(error);
    return redirect("/signup");
  }
}
