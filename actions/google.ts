"use server";

import { getSession } from "./auth";

const { google } = require("googleapis");

const googleOAuth = {
  client_id: process.env.AUTH_GOOGLE_ID || "",
  client_secret: process.env.AUTH_GOOGLE_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/google-callback",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

export async function getEmailMessages() {
  const session = await getSession();
  if (!session) return;

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
    //maxResults: 2,
    format: "full",
    q: 'from:(noreply@discord.com)'
  });
  /*const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;*/

  const messages = res.data.messages;

  const data = [];
  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
      format: "full",
    });
    const p = msg.data.payload['parts'][0].body.data;
    const decoded = Buffer.from(p, 'base64').toString('ascii');    
    console.log(`decoded: --------------------------------------------------`);
    console.log(decoded);
    data.push({ ...msg.data, decodedContent: decoded });    
  }  

  return data;
}
