import { prisma } from "@/db/prisma";
import { getImageOrientation } from "@/utils";
import { faker } from "@faker-js/faker";
import { Media } from "@prisma/client";
import { NextResponse } from "next/server";

function random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET(request: Request) {
  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);
  const media: Partial<Media>[] = [];

  for (const [i] of Array.from({ length: 80 }).entries()) {
    const fileName = "photo-" + i + ".jpeg";
    const path = "/photos_new/"+fileName;

    media.push({
      name: faker.lorem.words({ min: 1, max: 2 }).replace(" ", "_"),
      file: path,
      categoryId: random([1, 2, 3, 4]),
      description: faker.lorem.sentence(),
      galleryId: random([1, 2, 3, 4, 5]),
      userId: userIds[0],
      orientation: getImageOrientation(path),
      size: faker.number.int({ min: 100, max: 500 }),
      mediaTypeId: 1,
    });
  }

  await prisma.media.createMany({ data: media as Media[] });

  return NextResponse.json({ result: "done" });
}
