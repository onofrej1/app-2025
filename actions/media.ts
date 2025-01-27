'use server'

import { prisma } from "@/db/prisma";
import { checkImageOrientation } from "@/utils";
import { Media } from "@prisma/client";

export async function getMedia(galleryId: number) {
  const data: (Media & { orientation?: string })[]  = await prisma.media.findMany({
    //take: 3,
    /*where: {
        galleryId,
    },*/
    include: {
      user: {
        select: {
            firstName: true,
            lastName: true,
        }
      },
      mediaType: true,
      comments: true
    },    
  });

  const mediaFiles = data.map(d => {
    const orientation = checkImageOrientation(d.file);
    d.orientation = orientation ?? '';
    return d;
  });
  return mediaFiles; 
}