"use server";
import { auth } from "@/auth";
/*import GpxParser from "gpx-parser-ts";
import { GpxJson } from "gpx-parser-ts/dist/types";*/
const xml2js = require("xml2js");
const xmlParser = new xml2js.Parser({ attrkey: "ATTR" });
var togeojson = require('@mapbox/togeojson');

interface Point {
  lat: number, lng: number, elevation: number, time: number;
}
interface GpxData {
  name: string;
  type: string;
  time: number;
  coords: Point[];
}

export async function parseGpxData(formData: FormData) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }

  const file = formData.get('myFile') as Blob;
  const buffer = Buffer.from(await file.arrayBuffer());
  //const parser: GpxParser = new GpxParser();
  const coords: Point[] = [];

  /*const file = await fs.readFile("./files__/activity_17872238990.gpx", {
    encoding: "utf8",
  });*/
  //const gpxJson: GpxJson = await parser.parse(f);

  const data = await xmlParser.parseStringPromise(buffer.toString());

  const metadata = data.gpx.metadata[0];
  let name = '', type = '';

  const trackpoints: any[] = data.gpx.trk;
  trackpoints.forEach((t) => {
    name = t.name[0];
    type = t.type[0];
    t.trkseg.forEach((segment: any) => {
      segment.trkpt.forEach((e: any) => {
        const point = {
          lat: e.ATTR.lat,
          lng: e.ATTR.lon,
          time: e.time,
          elevation: e.ele,
        }
        coords.push(point);
      });
    });
  });
  
  return { time: metadata.time[0], name, type, coords } satisfies GpxData;
}
