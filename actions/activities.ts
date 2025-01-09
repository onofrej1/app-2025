"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";

export interface Point {
  lat: number;
  lng: number;
  elevation: number;
  time: Date;
  totalTime: number;
  distance: number;
  totalDistance: number;
  speed: number;
}

export interface GpxRecord {
  name: string;
  type: string;
  time: string;
  distance: number;
  duration: number;
  elevation: number;
  avgSpeed: number;
  avgPace: number;
  coords: Point[];
}

export async function getActivities() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const activities = await prisma.activity.findMany({
    where: {
      userId: session.userId,
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
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
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

export async function createActivity(data: GpxRecord) {
  console.log(data);
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }

  const activity = await prisma.activity.create({
    data: {
      userId: session.userId,
      name: "run",
      date: new Date(),
      type: "run",
      distance: data.distance,
      duration: data.duration,
      elevation: data.elevation,
      avgPace: data.avgPace,
      avgSpeed: data.avgSpeed
    },
  });

  const coords = data.coords.map((point) => ({
    activityId: activity.id,
    lat: Number(point.lat),
    lng: Number(point.lng),
    elevation: Number(point.elevation),
    time: new Date(point.time),
  }));
  await prisma.activityData.createMany({ data: coords });

  return data;
}
