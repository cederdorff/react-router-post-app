import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import User from "~/models/User";
import { sessionStorage } from "./session.server";
import { redirect } from "react-router";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<{ _id: string; accessToken: string; refreshToken: string | null }>();

authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: process.env.GITHUB_CALLBACK_URL!
    },
    async ({ tokens, request }) => {
      const gitHubUser = await getGitHubUser(tokens.accessToken());
      const userId = await findOrCreateUser(gitHubUser);

      return {
        _id: userId,
        accessToken: tokens.accessToken(),
        refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null
      };
    }
  ),
  "github"
);

async function getGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function findOrCreateUser(gitHubUser: any) {
  const { name, email, avatar_url } = gitHubUser;
  let dbUser = await User.findOne({ mail: email }).lean();
  if (!dbUser) {
    dbUser = await User.create({ name, mail: email, image: avatar_url });
  }
  return dbUser._id.toString();
}

// function that test is the user is authenticated else redirect to the signin page
export async function authenticateUser(request: Request) {
  // Get session from the request cookies
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  // Retrieve the 'user' value from the session
  const user = session.get("authUser");

  // If there's no user, redirect to the sign-in page
  if (!user) {
    throw redirect("/signin");
  }

  // If there's a user, return the user object
  return user;
}

export async function getAuthUser(request: Request) {
  // Get session from the request cookies
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  // Retrieve the 'user' value from the session
  const user = session.get("authUser");
  return user;
}
