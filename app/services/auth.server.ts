import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { CodeChallengeMethod, OAuth2Strategy } from "remix-auth-oauth2";
import User from "~/models/User";
import { sessionStorage } from "./session.server";

// ==================== Authenticator Setup ==================== //
// Create a new instance of the Authenticator
export const authenticator = new Authenticator<{ _id: string }>();

// ==================== GitHub Authentication ==================== //
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

// ==================== Google Authentication ==================== //
authenticator.use(
  new OAuth2Strategy(
    {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      redirectURI: process.env.GOOGLE_CALLBACK_URL!,
      scopes: ["openid", "email", "profile"],
      codeChallengeMethod: CodeChallengeMethod.S256 // Recommended security measure
    },
    async ({ tokens, request }) => {
      const googleUser = await getGoogleUser(tokens.accessToken());
      const userId = await createOrGetUser(googleUser.name, googleUser.email, googleUser.picture);
      return { _id: userId };
    }
  ),
  "google"
);

// ==================== Helper Functions ==================== //

/**
 * Retrieves the user from the GitHub API
 */
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

/**
 * Retrieves the user from the Google API
 */
async function getGoogleUser(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Finds an existing user or creates a new one in the database
 */
async function createOrGetUser(name: string, mail: string, image: string) {
  let dbUser = await User.findOne({ mail }).lean();
  if (!dbUser) {
    dbUser = await User.create({ name, mail, image });
  }
  return dbUser._id.toString();
}

// ==================== Authentication Utilities ==================== //
/**
 * Checks if a user is authenticated; otherwise, redirects to the sign-in page
 */
export async function authenticateUser(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    throw redirect("/signin");
  }
  return user;
}

/**
 * Retrieves the authenticated user from the session
 */
export async function getAuthUser(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  return session.get("authUser");
}
