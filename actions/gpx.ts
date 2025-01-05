"use server";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
/*import GpxParser from "gpx-parser-ts";
import { GpxJson } from "gpx-parser-ts/dist/types";*/
const xml2js = require("xml2js");
const xmlParser = new xml2js.Parser({ attrkey: "ATTR" });
const fs = require("fs").promises;

export async function parseGpxData(formData: FormData) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }

  const formObject = Object.fromEntries(formData.entries());
  console.log(formObject);
  const file = formData.get('myFile') as Blob;
  const buffer = Buffer.from(await file.arrayBuffer());
  //const parser: GpxParser = new GpxParser();
  const coords: any[] = [];

  /*const file = await fs.readFile("./files__/activity_17872238990.gpx", {
    encoding: "utf8",
  });*/
  //const gpxJson: GpxJson = await parser.parse(f);

  const data = await xmlParser.parseStringPromise(buffer.toString());
  const metadata = data.gpx.metadata[0];
  let name, type;

  const trackpoints: any[] = data.gpx.trk;
  trackpoints.forEach((t) => {
    name = t.name[0];
    type = t.type[0];
    t.trkseg.forEach((segment: any) => {
      segment.trkpt.forEach((e: any) => {
        //console.log(e);
        coords.push(e);
      });
    });
  });
  
  return { time: metadata.time[0], name, type, coords };
}
