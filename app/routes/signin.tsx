import { data, Form, NavLink, redirect } from "react-router";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/signin";

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

export default function SignIn() {
  return (
    <div id="sign-in-page" className="page">
      <h1>Sign In</h1>
      <Form id="sign-in-form" method="post">
        <label htmlFor="mail">Mail</label>
        <input id="mail" type="email" name="mail" aria-label="mail" placeholder="Type your mail..." required />

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
          <button>Sign In</button>
        </div>

        {/* {loaderData?.error ? (
          <div className="error-message">
            <p>{loaderData?.error?.message}</p>
          </div>
        ) : null} */}
      </Form>
      <p>
        No account? <NavLink to="/signup">Sign up here.</NavLink>
      </p>
    </div>
  );
}

// We need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: Route.ActionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object
  let user = await authenticator.authenticate("user-pass", request);

  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  session.set("user", user);

  throw redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) }
  });
}
