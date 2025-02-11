"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";
import { ActivityFeed, User } from "@prisma/client";

export async function getFeed() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const contacts = await prisma.userFriend.findMany({
    where: {
      OR: [
        {
          userId1: session.userId,
        },
        {
          userId2: session.userId,
        },
      ],
    },
  });
  const userContacts = contacts.map((c) => {
    return c.userId1 === session.userId ? c.userId2 : c.userId1;
  });

  const data = await prisma.activityFeed.findMany({
    where: {
      actorId: {
        in: userContacts,
      },
    },
    include: {
      actor: true,
    },
  });

  const feedData: (ActivityFeed & { actor: User, objectTitle: string })[] = [];

  for (const feed of data) {
    let objectTitle: string | undefined;
    //let targetTitle: string | undefined; TODO

    if (feed.objectType === "event") {
      const data = await prisma.event.findFirst({
        where: { id: feed.objectId },
        select: { name: true },
      });
      objectTitle = data?.name;
    } else if (feed.objectType === "task") {
      const data = await prisma.task.findFirst({
        where: { id: feed.objectId },
        select: { title: true },
      });
      objectTitle = data?.title;
    }
    feedData.push({
      ...feed,
      objectTitle: objectTitle || feed.objectId.toString(),
    });
  }

  return feedData;
}
