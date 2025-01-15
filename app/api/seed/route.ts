import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import { Post, Project, Task, TaskComment, Event, Run } from "@prisma/client";
import { NextResponse } from "next/server";

function random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET(request: Request) {
  const count = Array.from({ length: 5 });
  const categories = [];
  const tags = [];
  const organizers = [];
  const venues = [];

  const users = await prisma.user.findMany();
  const user = users[0];

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

  const categories_ = await prisma.category.createMany({ data: categories });
  const tags_ = await prisma.tag.createMany({ data: tags });
  const organizers_ = await prisma.organizer.createMany({ data: organizers });
  const venues_ = await prisma.venue.createMany({ data: venues });

  const _categories = await prisma.category.findMany();

  const posts: Partial<Post>[] = [];
  const projects: Partial<Project>[] = [];
  const tasks: Partial<Task>[] = [];
  const taskComments: Partial<TaskComment>[] = [];
  const events: Partial<Event>[] = [];
  const runs: Partial<Run>[] = [];

  for (const [i, element] of count.entries()) {
    posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: user.id,
      categoryId: _categories[0].id,
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

    events.push({
      name: faker.lorem.words({ min: 2, max: 3 }),
      description: faker.lorem.sentences(),
      color: faker.color.human(),
      location: faker.location.street + " " + faker.location.city,
      maxAttendees: faker.number.int({ min: 1, max: 9 }),
      contact: faker.person.fullName(),
      createdById: user.id,
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      organizerId: i % 2 === 0 ? i + 1 : null,
      venueId: i % 2 === 0 ? i + 1 : null,
      status: "Created",
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

  const posts_ = await prisma.post.createMany({ data: posts as Post[] });
  const projects_ = await prisma.project.createMany({
    data: projects as Project[],
  });
  const tasks_ = await prisma.task.createMany({ data: tasks as Task[] });
  const taskComments_ = await prisma.taskComment.createMany({
    data: taskComments as TaskComment[],
  });
  const events_ = await prisma.event.createMany({ data: events as Event[] });
  const runs_ = await prisma.run.createMany({ data: runs as Run[] });

  return NextResponse.json({ result: "done" });
}
