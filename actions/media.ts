'use server'

import { prisma } from "@/db/prisma";

export async function getMedia(galleryId: number) {
  const data = await prisma.media.findMany({
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
  
  return data; 
}