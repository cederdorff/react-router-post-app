import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/github";

//This will start the OAuth2 flow and redirect the user to the provider's login page.
//Once the user logs in and authorizes your application, the provider will redirect
//the user back to your application redirect URI.
export async function action({ request }: Route.ActionArgs) {
  await authenticator.authenticate("github", request);
}
