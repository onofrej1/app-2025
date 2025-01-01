"use server";

import { auth } from "@/auth";

const googleOAuth = {
  client_id: process.env.AUTH_GOOGLE_ID || "",
  client_secret: process.env.AUTH_GOOGLE_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/google-callback",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

const { google } = require("googleapis");

export async function getEmailMessages() {
  const session = await auth();
  if (!session) return;
  console.log("user session:");
  console.log(session.token);

  const oauth2Client = new google.auth.OAuth2(
    googleOAuth.client_id,
    googleOAuth.client_secret,
    ["http://localhost:3000/api/auth/callback/google"]
  );
  oauth2Client.setCredentials({
    access_token: session.token,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });
  /*const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;*/

  return res.data.messages;
}
