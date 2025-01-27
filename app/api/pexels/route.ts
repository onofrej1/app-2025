import download from "@/utils/download";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { NextResponse as NextServerResponse } from "next/server";

export async function GET(req: Request) {
  return;
  const url = "https://api.pexels.com/v1/curated?per_page=100";
  const response = await axios.get(url, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY,
    },
  });

  if (response.status === 200) {
    const data: { photos: any[]} = response.data;
    for (const [index, photo] of data.photos.entries()) {
      await download(photo.src.original, './public/photos_new', 'photo-'+index+'.jpeg');
    }
  }

  return new NextServerResponse(
    JSON.stringify({
      message: "Done",
    }),
    { status: 200 }
  );
}
