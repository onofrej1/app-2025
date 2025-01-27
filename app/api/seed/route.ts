import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import {
  Post,
  Project,
  Task,
  TaskComment,
  Event,
  Run,
  RunCategory,
  Comment,
  User,
  EventSchedule,
  Attendee,
  Registration,
  RunResult,
  Conversation,
  UserFriend,
  ConversationMember,
  Tag,
  Category,
  Organizer,
  Venue,
  EventType,
  FeedPost,
  FeedComment,
  FeedLike,
  Like,
  Profile,
  Address,
  MediaCategory,
  MediaType,
  Gallery,
  Media,
} from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { slugify } from "@/utils";

function random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET(request: Request) {
  const count = Array.from({ length: 5 });
  const categories: Partial<Category>[] = [];
  const tags: Partial<Tag>[] = [];
  const organizers: Partial<Organizer>[] = [];
  const venues: Partial<Venue>[] = [];
  const mediaCategories: Partial<MediaCategory>[] = [];
  const mediaTypes: Partial<MediaType>[] = [];

  const hashedPassword = await bcrypt.hash(
    process.env.TEST_USER_PASSWORD!,
    Number(process.env.BCRYPT_SALT!)
  );

  await prisma.user.create({
    data: {
      email: process.env.EMAIL_USER!,
      firstName: "John",
      lastName: "Doe",
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    },
  });

  mediaTypes.push(
    {
      name: "image",
      slug: "image",
    },
    {
      name: "video",
      slug: "video",
    }
  );

  for (const i of Array.from({ length: 100 })) {
    let title = faker.lorem.word();
    categories.push({
      title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });

    mediaCategories.push({
      name: faker.lorem.word(),
      details: faker.lorem.sentence(),
    });

    mediaCategories.push({
      name: faker.lorem.word(),
      details: faker.lorem.sentence(),
    });

    title = faker.lorem.word();
    tags.push({
      title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });

    organizers.push({
      name: faker.lorem.word(),
    });

    venues.push({
      location: faker.lorem.word(),
    });
  }

  await prisma.category.createMany({ data: categories as Category[] });
  await prisma.tag.createMany({ data: tags as Tag[] });
  await prisma.organizer.createMany({ data: organizers as Organizer[] });
  await prisma.venue.createMany({ data: venues as Venue[] });
  await prisma.mediaCategory.createMany({
    data: mediaCategories as MediaCategory[],
  });
  await prisma.mediaType.createMany({ data: mediaTypes as MediaType[] });

  const users: Partial<User>[] = [];
  const profiles: Partial<Profile>[] = [];
  const addresses: Partial<Address>[] = [];

  const posts: Partial<Post>[] = [];
  const comments: Partial<Comment>[] = [];
  const likes: Partial<Like>[] = [];
  const feedPosts: Partial<FeedPost>[] = [];
  const feedComments: Partial<FeedComment>[] = [];
  const feedLikes: Partial<FeedLike>[] = [];

  const projects: Partial<Project>[] = [];
  const tasks: Partial<Task>[] = [];
  const taskComments: Partial<TaskComment>[] = [];

  const events: Partial<Event>[] = [];
  const eventTypes: Partial<EventType>[] = [];
  const eventSchedules: Partial<EventSchedule>[] = [];
  const attendees: Partial<Attendee>[] = [];
  const galleries: Partial<Gallery>[] = [];

  const runs: Partial<Run>[] = [];
  const registrations: Partial<Registration>[] = [];
  const runResults: Partial<RunResult>[] = [];

  const conversations: Partial<Conversation>[] = [];
  const userFriends: Partial<UserFriend>[] = [];
  const conversationMembers: Partial<ConversationMember>[] = [];

  for (const [index] of count.entries()) {
    const i = index + 1;
    users.push({
      email: `user${i}@example.com`, //faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    });
  }

  await prisma.user.createMany({ data: users as User[] });
  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);

  eventTypes.push(
    {
      type: "Race",
    },
    {
      type: "Running kemp",
    }
  );

  userIds.slice(0, 3).map((userId) => {
    profiles.push({
      gender: random(["MALE", "FEMALE"]),
      userId,
      country: "SK",
      language: "SK",
      phone: "+421908123456",
      bio: faker.lorem.sentences(3),
      intro: faker.lorem.sentence(),
    });

    addresses.push({
      city: faker.location.city(),
      country: faker.location.country(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      street: faker.location.street(),
      userId,
    });
  });

  for (const [index] of count.entries()) {
    const i = index + 1;

    posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: random(userIds),
      status: random(["DRAFT", "PUBLISHED"]),
      metaTitle: faker.lorem.word(),
    });

    comments.push({
      comment: faker.lorem.paragraphs({ min: 3, max: 5 }),
      userId: random(userIds),
      postId: i,
      status: "APPROVED",
    });

    likes.push({
      userId: random(userIds),
      postId: i,
    });

    feedPosts.push({
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      userId: random(userIds),
      contentType: "text",
    });

    feedComments.push({
      comment: faker.lorem.paragraphs({ min: 3, max: 5 }),
      userId: random(userIds),
      postId: i,
      status: "APPROVED",
    });

    feedLikes.push({
      userId: random(userIds),
      commentId: i,
    });

    projects.push({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.lorem.word(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      managerId: random(userIds),
      cost: faker.number.int({ min: 300, max: 3000 }),
    });

    tasks.push({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: "TODO",
      dueDate: faker.date.future(),
      order: i,
      createdById: random(userIds),
      projectId: 1,
      priority: random(["HIGH", "LOWER"]),
    });

    taskComments.push({
      comment: faker.lorem.sentences(),
      userId: random(userIds),
      taskId: i,
    });

    const startDate = new Date();
    const endDate = startDate;

    events.push({
      name: faker.lorem.words({ min: 2, max: 3 }),
      description: faker.lorem.sentences(),
      color: faker.internet.color(),
      location: faker.location.street() + " " + faker.location.city(),
      maxAttendees: faker.number.int({ min: 1, max: 9 }),
      contact: faker.person.fullName(),
      createdById: random(userIds),
      startDate,
      endDate,
      organizerId: i % 2 === 0 ? i : null,
      venueId: i % 2 === 0 ? i : null,
      status: "Created",
      eventTypeId: random([1, 2]),
    });

    const startTime = new Date(startDate);
    startTime.setHours(5);
    const endTime = new Date(startTime);
    endTime.setHours(7);

    eventSchedules.push({
      activity: faker.lorem.words({ min: 2, max: 3 }),
      location: faker.location.streetAddress() + " " + faker.location.city(),
      startTime,
      endTime,
      eventId: i,
    });

    attendees.push({
      status: random(["PENDING", "YES", "MAYBE", "NO", "ATTENDED"]),
      eventId: random([1, 2, 3]),
      userId: random(userIds),
    });

    runs.push({
      title: faker.lorem.words({ min: 2, max: 3 }),
      distance: random([5000, 10000, 21097, 15000]),
      elevation: faker.number.int({ min: 10, max: 600 }),
      price: random([10, 15, 20, 25]),
      surface: random(["road", "grass"]),
      eventId: i,
      tshirt: i % 2 === 0 ? true : false,
    });

    galleries.push({
      name: faker.lorem.word(),
      userId: userIds[0],
      description: faker.lorem.sentence(),
      eventId: i,
    });
  }

  for (let j = 0; j < 4; j++) {
    const i = j + 1;
    conversations.push({
      isGroup: false,
    });

    userFriends.push({
      userId1: userIds[0],
      userId2: userIds[i],
      status: "APPROVED",
      actionUserId: userIds[i],
    });

    conversationMembers.push({
      conversationId: i,
      userId: userIds[0],
    });

    conversationMembers.push({
      conversationId: i,
      userId: userIds[i],
    });
  }

  for (let j = 4; j < 8; j++) {
    const i = j + 1;
    conversations.push({
      isGroup: false,
    });

    userFriends.push({
      userId1: userIds[4],
      userId2: userIds[i - 4],
      status: "APPROVED",
      actionUserId: userIds[i - 4],
    });

    conversationMembers.push({
      conversationId: i,
      userId: userIds[4],
    });

    conversationMembers.push({
      conversationId: i,
      userId: userIds[i - 4],
    });
  }

  const clubs = [
    "BK Furca Kosice",
    "BKO Vysna Mysla",
    "Obal servis Kosice",
    "US Steel Kosice",
    "Presov running team",
  ];

  const rank: Record<number, number> = {};
  for (let i = 0; i < 150; i++) {
    const runId = random([1, 2, 3]);
    if (!rank[runId]) rank[runId] = 0;

    registrations.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: random(["MALE", "FEMALE"]),
      dateOfBirth: faker.date.past(),
      city: faker.location.city(),
      nation: faker.location.state(),
      club: random(clubs),
      paid: false,
      presented: false,
      runId,
      phone: faker.phone.number(),
    });

    runResults.push({
      name: faker.person.fullName(),
      category: random(["A", "B", "C", "D", "E", "F"]),
      club: random(clubs),
      bib: faker.number.int({ min: 50, max: 250 }),
      gender: random(["MALE", "FEMALE"]),
      rank: ++rank[runId],
      runId,
      yearOfBirth: random([1980, 1984, 1965, 1998, 2002]),
      time: 1200 + i * 5,
    });
  }

  const runCategories: Partial<RunCategory>[] = [
    {
      category: "A",
      title: "Muzi do 39 rokov",
    },
    {
      category: "B",
      title: "Muzi do 49 rokov",
    },
    {
      category: "C",
      title: "Muzi do 59 rokov",
    },
    {
      category: "D",
      title: "Muzi nad 60 rokov",
    },
    {
      category: "F",
      title: "Zeny do 39 rokov",
    },
    {
      category: "G",
      title: "Zeny nad 39 rokov",
    },
  ];

  const media: Partial<Media>[] = [];

  for (const [i] of Array.from({ length: 80 }).entries()) {
    media.push({
      name: faker.lorem.words({ min: 1, max: 2 }).replace(" ", "_"),
      file: "/photos_new/photo-" + i + ".jpeg",
      categoryId: random([1, 2, 3, 4]),
      description: faker.lorem.sentence(),
      galleryId: random([1, 2, 3, 4, 5]),
      userId: userIds[0],
      size: faker.number.int({ min: 100, max: 500 }),
      mediaTypeId: 1,
    });
  }

  await prisma.post.createMany({ data: posts as Post[] });

  await prisma.comment.createMany({
    data: comments as Comment[],
  });
  await prisma.like.createMany({ data: likes as Like[] });
  await prisma.feedPost.createMany({ data: feedPosts as FeedPost[] });
  await prisma.feedComment.createMany({
    data: feedComments as FeedComment[],
  });
  await prisma.feedLike.createMany({ data: feedLikes as FeedLike[] });
  await prisma.project.createMany({
    data: projects as Project[],
  });
  await prisma.task.createMany({ data: tasks as Task[] });
  await prisma.taskComment.createMany({
    data: taskComments as TaskComment[],
  });
  await prisma.eventType.createMany({ data: eventTypes as EventType[] });
  await prisma.event.createMany({ data: events as Event[] });
  await prisma.eventSchedule.createMany({
    data: eventSchedules as EventSchedule[],
  });
  await prisma.attendee.createMany({
    data: attendees as Attendee[],
  });
  await prisma.run.createMany({ data: runs as Run[] });
  await prisma.runCategory.createMany({
    data: runCategories as RunCategory[],
  });
  await prisma.gallery.createMany({
    data: galleries as Gallery[],
  });
  await prisma.media.createMany({ data: media as Media[] });

  await prisma.registration.createMany({
    data: registrations as Registration[],
  });
  await prisma.runResult.createMany({
    data: runResults as RunResult[],
  });
  await prisma.conversation.createMany({
    data: conversations as Conversation[],
  });
  await prisma.userFriend.createMany({
    data: userFriends as UserFriend[],
  });
  await prisma.conversationMember.createMany({
    data: conversationMembers as ConversationMember[],
  });

  return NextResponse.json({ result: "done" });
}
