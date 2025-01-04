"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export async function getActivities() {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error('unauthorized')
  }
  const activities = await prisma.activity.findMany({
    where: {
      userId: loggedUser.id,
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      id: true,
      date: true,
      name: true,
      type: true,
      distance: true,
      duration: true,
      activityData: true,
    },
  });
  return activities;
}

export async function getActivity(id: number) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error('unauthorized')
  }
  const activity = await prisma.activity.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      id: true,
      date: true,
      name: true,
      type: true,
      distance: true,
      duration: true,
      activityData: true,
    },
  });
  return activity;
}
