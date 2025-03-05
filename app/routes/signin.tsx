import { data, Form, redirect } from "react-router";
import { authenticator, getAuthUser } from "~/services/auth.server";
import type { Route } from "./+types/signin";

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
      <p>Sign in with your email and password.</p>
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

// We need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: Route.ActionArgs) {
  try {
    // we call the method with the name of the strategy we want to use and the
    // request object
    let userId = await authenticator.authenticate("user-pass", request);
    let session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.set("authUserId", userId);
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
