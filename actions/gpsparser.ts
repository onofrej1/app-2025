"use server";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
/*import GpxParser from "gpx-parser-ts";
import { GpxJson } from "gpx-parser-ts/dist/types";*/
const xml2js = require("xml2js");
const xmlParser = new xml2js.Parser({ attrkey: "ATTR" });
const fs = require("fs").promises;

export async function parse() {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }
  //const parser: GpxParser = new GpxParser();
  const coords: any[] = [];

  const file = await fs.readFile("./files__/activity_17872238990.gpx", {
    encoding: "utf8",
  });
  //const gpxJson: GpxJson = await parser.parse(f);

  const data = await xmlParser.parseStringPromise(file);

  //console.log(record.gpx.trk[0]);
  (data.gpx.trk as any[]).forEach((t) => {
    t.trkseg.forEach((trkpt: any) => {
      trkpt.trkpt.forEach((e: any) => {
        //console.log(e);
        coords.push(e);
      });
    });
  });

  const activity = await prisma.activity.create({
    data: {
      userId: loggedUser.id,
      name: "run",
      date: new Date(),
      type: "run",
      distance: 10000,
      duration: 300,
    },
  });
  for (const point of coords) {
    //console.log(point);
    await prisma.activityData.create({
      data: {
        activityId: activity.id,
        lat: Number(point.ATTR.lat),
        long: Number(point.ATTR.lon),
        elevation: Number(point.ele),
        time: new Date(point.time),
      },
    });
  }
  return data;

  //
}
