"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";

export async function sendFriendRequest(email: string) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return { message: "User with this email not found" };
  }
  const result = await prisma.friendRequest.create({
    data: {
      sender: { connect: { id: session.userId } },
      receiver: { connect: { id: user.id } },
      //receiver: fromUser,
    },
  });
  return result;
}

export async function approveFriendRequest(id: number) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const friendRequest = await prisma.friendRequest.findUniqueOrThrow({
    where: {
      id,
      receiver: {
        id: session.userId,
      },
    },
    select: {
      receiver: true,
      sender: true,
    },
  });
  if (!friendRequest) {
    throw new Error("Unauthorized action");
  }
  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
    },
    select: {
      id: true,
    },
  });
  await prisma.contact.create({
    data: {
      user1: { connect: { id: friendRequest.sender.id } },
      user2: { connect: { id: friendRequest.receiver.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: friendRequest.sender.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: friendRequest.receiver.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });

  await prisma.friendRequest.delete({ where: { id } });
}

export async function getFriendRequests() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return [];
    //throw new Error("Unauthorized");
  }
  return prisma.friendRequest.findMany({
    where: {
      receiver: {
        id: session.userId,
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

export async function getMessages(conversationId: number) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    select: {
      id: true,
      content: true,
      type: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function createMessage(
  conversationId: number,
  content: string,
  type: string = "text"
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const message = await prisma.message.create({
    data: {
      content,
      type,
      senderId: session.userId,
      conversationId,
    },
    select: {
      id: true,
      content: true,
      type: true,
      sender: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessage: { connect: { id: message.id } },
    },
  });
}

export async function getConversations() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const loggedUserConversations = await prisma.conversationMember.findMany({
    where: {
      userId: session.userId,
    },
    select: {
      conversationId: true,
    },
  });
  return prisma.conversationMember.findMany({
    where: {
      conversationId: {
        in: loggedUserConversations.map((c) => c.conversationId),
      },
      userId: {
        not: session.userId,
      },
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      lastSeenMessage: true,
      conversation: {
        select: {
          id: true,
          isGroup: true,
          name: true,
          lastMessage: {
            select: {
              sender: true,
              content: true,
            },
          },
          messages: {
            select: {
              content: true,
              type: true,
              sender: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
  /*return prisma.contact.findMany({
    where: {
      OR: [
        {
          user1: {
            id: loggedUser.id,
          },
          user2: {
            id: loggedUser.id,
          },
        },
      ],
    },
    include: {
      conversation: {
        select: {
          id: true,
          name: true,
          isGroup: true,
          lastMessage: {
            select: {
              id: true,
              content: true,
              type: true,
              sender: {
                select: {
                  name: true,
                  email: true,
                }
              }
            },
          },
        },
      },
    },
  });*/
}

export async function getConversation() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  const loggedUserConversations = await prisma.conversationMember.findMany({
    where: {
      userId: session.userId,
    },
    select: {
      conversationId: true,
    },
  });
  return prisma.conversation.findFirstOrThrow({
    where: {
      id: 1,
    },
    select: {
      id: true,
      conversationMembers: {
        select: {
          lastSeenMessage: {
            select: {
              id: true,
              sender: true,
            }
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      isGroup: true,
      name: true,
      
      lastMessage: {
        select: {
          sender: true,
          content: true,
        },
      },
      messages: {
        select: {
          content: true,
          type: true,
          sender: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}
