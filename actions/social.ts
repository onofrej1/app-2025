"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";

export async function createFeedPost(content: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  const result = await prisma.feedPost.create({
    data: {
      content,
      userId: session.userId,
      contentType: 'text',
    },
  });
  return result;
}

export async function getFeedPosts(userId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userIds = await prisma.userFriend.findMany({ where: 
    {
      OR: [
        { userId1: session.userId },
        { userId2: session.userId }
      ]
    },
    select: {
      userId1: true,
      userId2: true,
    }
  });
  const ids = userIds.map(u => u.userId1 === session.userId ? u.userId2 : u.userId1 );
  
  const result = await prisma.feedPost.findMany({
    where: {
      userId: {
        in: [session.userId, ...ids]
      }
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      },
      content: true,
      contentType: true,
      comments: true,
      createdAt: true,
    }
  });
  return result;
}

export async function sendFriendRequest(email: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return { message: "User with this email not found" };
  }
  const result = await prisma.userFriend.create({
    data: {
      user1: { connect: { id: session.userId } },
      user2: { connect: { id: user.id } },
      actionUser: { connect: { id: user.id } },
      status: 'PENDING'
    },
  });
  return result;
}

export async function approveFriendRequest(id: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userFriend = await prisma.userFriend.findUniqueOrThrow({
    where: {
      id,
      user2: {
        id: session.userId,
      },
      status: 'PENDING'
    },
    select: {
      id: true,
      user1: true,
      user2: true,
    },
  });
  if (!userFriend) {
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
  await prisma.userFriend.update({
    where: {
        id: userFriend.id
    },
    data: {
      status: 'APPROVED',
      actionUserId: session.userId,
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: userFriend.user1.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: userFriend.user2.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });
}

export async function getFriendRequests() {
  const session = await getSession();
  if (!session) {
    return [];
    //throw new Error("Unauthorized");
  }
  return prisma.userFriend.findMany({
    where: {
      status: 'PENDING',
      user2: {
        id: session.userId,
      },
    },
    include: {
      user1: {
        select: {
          email: true,
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getMessages(conversationId: number) {
  const session = await getSession();
  if (!session) {
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
          firstName: true,
          lastName: true,
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
  if (!session) {
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
          firstName: true,
          lastName: true,
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
  if (!session) {
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
          firstName: true,
          lastName: true,
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
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/*export async function getConversation() {
  const session = await getSession();
  if (!session) {
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
              firstName: true,
              lastName: true,
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
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
}*/
