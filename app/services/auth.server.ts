import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { CodeChallengeMethod, OAuth2Strategy } from "remix-auth-oauth2";
import User from "~/models/User";
import { sessionStorage } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<{ _id: string }>();

//  ==================== GitHub ==================== //
authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: process.env.GITHUB_CALLBACK_URL!
    },
    async ({ tokens, request }) => {
      const gitHubUser = await getGitHubUser(tokens.accessToken());

      const userId = await createOrGetUser(gitHubUser.name, gitHubUser.email, gitHubUser.avatar_url);

      return {
        _id: userId
      };
    }
  ),
  "github"
);

async function getGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

//  ==================== Google ==================== //
authenticator.use(
  new OAuth2Strategy(
    {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      redirectURI: process.env.GOOGLE_CALLBACK_URL!,
      scopes: ["openid", "email", "profile"],
      codeChallengeMethod: CodeChallengeMethod.S256 // Optional but recommended
    },
    async ({ tokens, request }) => {
      const googleUser = await getGoogleUser(tokens.accessToken());

      const userId = await createOrGetUser(googleUser.name, googleUser.email, googleUser.picture);

      return {
        _id: userId
      };
    }
  ),
  "google"
);

async function getGoogleUser(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ==================== Helper functions ==================== //
async function createOrGetUser(name: string, mail: string, image: string) {
  let dbUser = await User.findOne({ mail }).lean();
  if (!dbUser) {
    dbUser = await User.create({ name, mail, image });
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
