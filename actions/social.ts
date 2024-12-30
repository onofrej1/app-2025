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

export async function approveFriendRequest(id: number) {
  const session = await auth();
  const loggedUser = session?.user;
  if (!loggedUser) {
    throw new Error("Unauthorized");
  }
  const friendRequest = await prisma.friendRequest.findUniqueOrThrow({
    where: {
      id,
      receiver: {
        id: loggedUser.id
      }
    },
    select: {
      receiver: true,
      sender: true,
    }
  });
  if (!friendRequest) {
    throw new Error('Unauthorized action');
  }
  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
    },
    select: {
      id: true
    }
  })
  await prisma.contact.create({
    data: {
      user1: { connect: { id: friendRequest.sender.id }},
      user2: { connect: { id: friendRequest.receiver.id }},
      conversation: { connect: { id: conversation.id }}
    }
  });
  await prisma.friendRequest.delete({ where: { id }});
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
