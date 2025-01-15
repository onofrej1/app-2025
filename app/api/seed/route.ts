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
} from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET(request: Request) {
  const count = Array.from({ length: 5 });
  const categories = [];
  const tags = [];
  const organizers = [];
  const venues = [];

  const hashedPassword = await bcrypt.hash(
    process.env.TEST_USER_PASSWORD!,
    Number(process.env.BCRYPT_SALT!)
  );

  const user = await prisma.user.create({
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
  /*const existingUsers = await prisma.user.findMany();
  const user = existingUsers[0];*/

  for (const i of count) {
    categories.push({
      title: faker.lorem.word(),
    });
    tags.push({
      title: faker.lorem.word(),
    });
    organizers.push({
      name: faker.lorem.word(),
    });
    venues.push({
      location: faker.lorem.word(),
    });
  }

  await prisma.category.createMany({ data: categories });
  await prisma.tag.createMany({ data: tags });
  await prisma.organizer.createMany({ data: organizers });
  await prisma.venue.createMany({ data: venues });

  const users: Partial<User>[] = [];
  const posts: Partial<Post>[] = [];
  const comments: Partial<Comment>[] = [];
  const projects: Partial<Project>[] = [];
  const tasks: Partial<Task>[] = [];
  const taskComments: Partial<TaskComment>[] = [];
  const events: Partial<Event>[] = [];
  const eventSchedules: Partial<EventSchedule>[] = [];
  const attendees: Partial<Attendee>[] = [];
  const runs: Partial<Run>[] = [];
  const registrations: Partial<Registration>[] = [];
  const runResults: Partial<RunResult>[] = [];

  for (const [i, element] of count.entries()) {
    users.push({
      email: `user${i + 1}@example.com`, //faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    });

    posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: user.id,
      categoryId: random([1, 2, 3]),
    });

    comments.push({
      comment: faker.lorem.paragraphs({ min: 3, max: 5 }),
      userId: user.id,
      postId: i + 1,
    });

    projects.push({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.lorem.word(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      managerId: user.id,
    });

    tasks.push({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: "TODO",
      dueDate: faker.date.future(),
      order: i + 1,
      assigneeId: user.id,
      createdById: user.id,
      projectId: 1,
    });

    taskComments.push({
      comment: faker.lorem.sentences(),
      userId: user.id,
      taskId: i + 1,
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
      createdById: user.id,
      startDate,
      endDate,
      organizerId: i % 2 === 0 ? i + 1 : null,
      venueId: i % 2 === 0 ? i + 1 : null,
      status: "Created",
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
      eventId: i + 1,
    });

    attendees.push({
      attended: false,
      status: random(["YES", "MAYBE", "NO"]),
      eventId: random([1, 2, 3]),
      userId: user.id,
    });

    runs.push({
      title: faker.lorem.words({ min: 2, max: 3 }),
      distance: random([5000, 10000, 21097, 15000]),
      elevation: faker.number.int({ min: 10, max: 600 }),
      price: random([10, 15, 20, 25]),
      surface: random(["road", "grass"]),
      eventId: i + 1,
      tshirt: i % 2 === 0 ? true : false,
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
  for(let i = 0; i < 150; i++) {
    const runId = random([1, 2, 3]);
    if (!rank[runId]) rank[runId] = 0;

    registrations.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: random(["MAN", "WOMAN"]),
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
      gender: random(["MAN", "WOMAN"]),
      rank: ++rank[runId],
      runId,
      yearOfBirth: random([1980, 1984, 1965, 1998, 2002]),
      time: 1200 + i * 50,
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

  await prisma.user.createMany({ data: users as User[] });
  await prisma.post.createMany({ data: posts as Post[] });
  await prisma.comment.createMany({
    data: comments as Comment[],
  });
  await prisma.project.createMany({
    data: projects as Project[],
  });
  await prisma.task.createMany({ data: tasks as Task[] });
  await prisma.taskComment.createMany({
    data: taskComments as TaskComment[],
  });
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
  await prisma.registration.createMany({
    data: registrations as Registration[],
  });
  await prisma.runResult.createMany({
    data: runResults as RunResult[],
  });

  return NextResponse.json({ result: "done" });
}
