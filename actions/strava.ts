"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

export async function getActivities() {
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

  var StravaApiV3 = require("./../../strava-api-v3");
  var defaultClient = StravaApiV3.ApiClient.instance;

  var strava_oauth = defaultClient.authentications["strava_oauth"];
  strava_oauth.accessToken = data.accessToken;

  var api = new StravaApiV3.ActivitiesApi();

  var id = '';

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
  return activities;
}