import bcrypt from "bcrypt";
import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import User from "~/models/User";
import { sessionStorage } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<string>();

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const mail = form.get("mail");
    const password = form.get("password");

    // do some validation, errors are saved in the sessionErrorKey
    if (!mail || typeof mail !== "string" || !mail.trim()) {
      throw new Error("Email is required and must be a string");
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      throw new Error("Password is required and must be a string");
    }

    // verify the user
    return await verifyUser(mail, password);
  }),
  "user-pass"
);

async function verifyUser(mail: string, password: string) {
  const user = await User.findOne({ mail }).select("+password");
  if (!user) {
    throw new Error("No user found with this email.");
    // throw new AuthorizationError("No user found with this email.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password.");
  }

  // return the user id to be stored in the session
  return user._id.toString();
}

export async function authenticate(request: Request, returnTo?: string) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let authUserId = session.get("authUserId");
  if (authUserId) {
    return authUserId;
  }
  if (returnTo) {
    session.set("returnTo", returnTo);
  }
  throw redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) }
  });
}
