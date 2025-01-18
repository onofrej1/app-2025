import { redirect } from "next/navigation";
const crypto = require("crypto");

export const githubOAuth = {
  client_id: process.env.GITHUB_ID || "",
  client_secret: process.env.GITHUB_SECRET || "",
  endpoint: "https://github.com/login/oauth/authorize",
  redirect_uri: process.env.BASE_URL + "/api/oauth/github/callback",
  scopes: "repo",
};

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  //localStorage.setItem("latestCSRFToken", state);  

  redirect(
    `${githubOAuth.endpoint}?state=${state}&client_id=${githubOAuth.client_id}&response_type=code&scope=${githubOAuth.scopes}&redirect_uri=${githubOAuth.redirect_uri}&page=calendar`
  );
}
