import { redirect } from "next/navigation";
const crypto = require("crypto");

export const googleOAuth = {
  client_id: process.env.AUTH_GOOGLE_ID || "",
  client_secret: process.env.AUTH_GOOGLE_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/oauth/google/callback",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  //localStorage.setItem("latestCSRFToken", state);  

  redirect(
    `${googleOAuth.endpoint}?state=${state}&client_id=${googleOAuth.client_id}&response_type=code&scope=${googleOAuth.scopes}&redirect_uri=${googleOAuth.redirect_uri}&page=calendar`
  );
}
