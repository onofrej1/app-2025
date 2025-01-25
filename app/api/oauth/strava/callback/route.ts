//import { auth } from "@/auth";
import { getSession } from "@/actions/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

const stravaOAuth = {
  client_id: process.env.STRAVA_CLIENT_ID || "",
  client_secret: process.env.STRAVA_CLIENT_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/strava-callback",
  scopes: "read,activity:read",
};

export async function GET(request: Request) {
  const session = await getSession();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }
  
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const page = url.searchParams.get("page");

  const params = {
    client_id: stravaOAuth.client_id,
    client_secret: stravaOAuth.client_secret,
    code: code,
    grant_type: "authorization_code",
  };

  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    console.log("oauth error");
  }

  const data = await response.json();
  await prisma.oAuthToken.create({
    data: {
        userId: session.userId,
        provider: 'strava',
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    },    
  });

  if (page) {
    redirect(page);
  } else {
    redirect('/');
  }
}

/*export async function fetchActivities() {
  const token = window.localStorage.getItem("strava_token");
  if (!token) {
    redirect("/api/strava-oauth");
  }
  const data_response = await fetch(
    "https://www.strava.com/api/v3/activities/13231456464",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data_response.ok) {
    console.log('An error occured fetching activities');
  }

  const activities = await data_response.json();  
  return activities;
}*/
