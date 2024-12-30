"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export async function sendFriendRequest(email: string) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    return { message: "User not logged" };
  }
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return { message: "User with this email not found" };
  }
  const result = await prisma.friendRequest.create({
    data: {
      sender: { connect: { id: loggedUser.id } },
      receiver: { connect: { id: user.id } },
      //receiver: fromUser,
    },
  });
  return result;
}

export async function getFriendRequests() {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }
  return prisma.friendRequest.findMany({
    where: {
      receiver: {
        id: loggedUser.id,
      },
    },
    include: {
      sender: {
        select: {
          email: true,
          id: true,
          name: true,
        },
      },
    },
  });
}
