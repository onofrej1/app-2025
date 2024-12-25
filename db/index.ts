/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaModel } from "@/resources/resources.types";
import { prisma } from "./prisma";

export async function prismaQuery(
  resource: PrismaModel,
  operation: any,
  args: any
) {
  if (args) {
    return (prisma[resource][operation] as any)(args);
  }
  return (prisma[resource][operation] as any)();
}
