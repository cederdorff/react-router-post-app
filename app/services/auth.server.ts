import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import type { UserType } from "~/models/User";
import User from "~/models/User";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<UserType>();

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const mail = form.get("mail");
    const password = form.get("password");

    // do some validation, errors are saved in the sessionErrorKey
    if (!mail || typeof mail !== "string" || !mail.trim()) {
      throw new Error("Email is required and must be a string");
      // throw new AuthorizationError("Email is required and must be a string");
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      throw new Error("Password is required and must be a string");
      // throw new AuthorizationError("Password is required and must be a string");
    }

    // verify the user
    const user = await verifyUser(mail, password);
    if (!user) {
      // if problem with user throw error AuthorizationError
      // throw new AuthorizationError("User not found");
    }
    console.log(user);
    return user;
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
    // throw new AuthorizationError("Invalid password.");
  }
  // Remove the password from the user object before returning it
  // delete user.password;
  return user;
}
