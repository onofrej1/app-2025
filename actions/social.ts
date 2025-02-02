"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";
import { FeedPost } from "@prisma/client";

export async function createMediaFeedPost({
  mediaUrl,
  contentType,
}: {
  mediaUrl: string;
  contentType: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.feedPost.create({
    data: {
      userId: session.userId,
      contentType,
      mediaUrl,
    },
  });
  return { success: true };
}

export async function createFeedPost(data: Partial<FeedPost>) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.feedPost.create({
    data: {
      content: data.content,
      userId: session.userId,
      contentType: "text",
    },
  });

  return { success: true };
}

export async function commentPost(postId: number, comment: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.feedComment.create({
    data: {
      comment,
      userId: session.userId,
      postId,
    },
  });
  return result;
}

export async function replyToComment(commentId: number, comment: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.feedComment.create({
    data: {
      comment,
      userId: session.userId,
      parentId: commentId,
    },
  });
  return result;
}

export async function getFeedPosts() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.userId;
  const userIds = await prisma.userFriend.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
    },
    select: {
      userId1: true,
      userId2: true,
    },
  });
  const ids = userIds.map((u) =>
    u.userId1 === userId ? u.userId2 : u.userId1
  );
  console.log(userId);
  console.log(ids);
  const result = await prisma.feedPost.findMany({
    where: {
      userId: {
        in: [userId, ...ids],
      },
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      content: true,
      contentType: true,
      mediaUrl: true,
      comments: {
        select: {
          comment: true,
          id: true,
          user: true,
          publishedAt: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });
  return result;
}

export async function getComments(parentId: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.feedComment.findMany({
    where: {
      parentId,
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      comment: true,
      publishedAt: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
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
      status: "PENDING",
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
      status: "PENDING",
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
      id: userFriend.id,
    },
    data: {
      status: "APPROVED",
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
      status: "PENDING",
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
