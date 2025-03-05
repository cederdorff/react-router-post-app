import { data, Form, NavLink, redirect } from "react-router";
import { authenticator, getAuthUser } from "~/services/auth.server";
import type { Route } from "./+types/signin";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getAuthUser(request);
  if (user) {
    return redirect("/");
  }
}

export default function SignIn({ actionData }: Route.ComponentProps) {
  return (
    <div id="sign-in-page" className="page">
      <h1>Sign In</h1>
      <p>Sign in with email and password.</p>
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

        {actionData?.error ? (
          <div className="error-message">
            <p>{actionData?.error}</p>
          </div>
        ) : null}
      </Form>
      <p>
        No account? <NavLink to="/signup">Sign up here</NavLink>.
      </p>

      <p>Or sign in with your GitHub or Google account.</p>
      <div className="oauth-form-container">
        <Form method="post" action="/auth/github">
          <div className="btns full">
            <button>Sign In with GitHub</button>
          </div>
        </Form>
        <Form method="post" action="/auth/google">
          <div className="btns full">
            <button>Sign In with Google</button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }: Route.ActionArgs) {
  try {
    let authUser = await authenticator.authenticate("email-pass", request);
    if (!authUser) {
      return redirect("/signin");
    }
    const session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.set("authUser", authUser);
    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) }
    });
  } catch (error) {
    if (error instanceof Error) {
      // here the error related to the authentication process
      return data({ error: error.message });
    }
  }
}
