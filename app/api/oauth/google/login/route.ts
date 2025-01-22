import { googleOAuth } from "@/utils/oauth";
import { redirect } from "next/navigation";
const crypto = require("crypto");

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  //localStorage.setItem("latestCSRFToken", state);  

  redirect(
    `${googleOAuth.endpoint}?state=${state}&client_id=${googleOAuth.client_id}&response_type=code&scope=${googleOAuth.scopes}&redirect_uri=${googleOAuth.redirect_uri}&page=calendar`
  );
}
