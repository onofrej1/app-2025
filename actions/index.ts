/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { redirect } from "next/navigation";
import { PrismaModel } from "@/resources/resources.types";
import { prisma } from "@/db/prisma";

export async function prismaAction(
  resource: PrismaModel,
  operation: any,
  args: any
) {
  if (args) {
    return (prisma[resource][operation] as any)(args);
  }
  return (prisma[resource][operation] as any)();
}


export async function navigate(path: string) {
  return redirect(path);
}
