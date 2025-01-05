"use server";

import { prisma } from "@/db/prisma";

export async function getEvents() {
  return prisma.event.findMany();
}

export async function getEvent(id: number) {
  return prisma.event.findFirstOrThrow({
    where: {
      id,
    }
  });
}
