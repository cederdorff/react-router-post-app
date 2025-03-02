import { Form, redirect } from "react-router";
import { getAuthUser } from "~/services/auth.server";
import type { Route } from "./+types/signin";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getAuthUser(request);
  if (user) {
    return redirect("/");
  }
}

export default function SignIn() {
  return (
    <div id="sign-in-page" className="page">
      <h1>Sign In</h1>
      <Form id="sign-in-form" method="post" action="/auth/github">
        <div className="btns full">
          <button>Sign In with GitHub</button>
        </div>
      </Form>
    </div>
  );
}
