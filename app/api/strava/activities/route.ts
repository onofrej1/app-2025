import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
var StravaApiV3 = require("./../../../../../strava-api-v3");

export async function GET(request: Request) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }
  const data = await prisma.oAuthToken.findFirst({
    where: {
      userId: loggedUser.id,
      provider: "strava",
    },
    select: {
      accessToken: true,
    },
  });

  if (!data?.accessToken) {
    redirect("/api/strava-oauth");
  }

  var defaultClient = StravaApiV3.ApiClient.instance;

  var strava_oauth = defaultClient.authentications["strava_oauth"];
  strava_oauth.accessToken = data.accessToken;

  var api = new StravaApiV3.ActivitiesApi();

  var id = 13231456464;

  var options = {
    includeAllEfforts: false,
  };

  const activities = await new Promise(function (resolve, reject) {
    api.getActivityById(id, options, (error: any, data: any, response: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
  //console.log(activities);
  return NextResponse.json({ activities });
}
