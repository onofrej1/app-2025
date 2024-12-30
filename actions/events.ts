"use server";

import { prisma } from "@/db/prisma";

export async function getEvents() {
  return prisma.event.findMany();
}
