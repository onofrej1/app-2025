import { githubOAuth } from "@/utils/oauth";
import { redirect } from "next/navigation";
const crypto = require("crypto");

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  //localStorage.setItem("latestCSRFToken", state);  

  redirect(
    `${githubOAuth.endpoint}?state=${state}&client_id=${githubOAuth.client_id}&response_type=code&scope=${githubOAuth.scopes}&redirect_uri=${githubOAuth.redirect_uri}&page=calendar`
  );
}
