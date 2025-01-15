"use server";

import { prisma } from "@/db/prisma";

export async function getUsers() {
  return prisma.user.findMany();
}
