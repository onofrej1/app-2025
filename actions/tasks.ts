"use server";

import { prisma } from "@/db/prisma";
import { Task } from "@prisma/client";
import { getSession } from "./auth";
import { Action, Model } from "@/types";

export async function getTasks(projectId: number) {
  return prisma.task.findMany({ where: { projectId } });
}

export async function updateTasks(tasks: Task[]) {
  //return prisma.task.findMany({ where: { projectId } });
}

export async function getProjects() {
  return prisma.project.findMany();
}

export async function createTask(task: Task) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const tasks = await prisma.task.findMany({
    where: { projectId: task.projectId, status: task.status },
    orderBy: [
      {
        order: "desc",
      },
    ],
    take: 1,
  });
  task.createdById = session.userId;
  task.status = "TODO";
  task.order = tasks.length > 0 ? tasks[0].order + 1 : 1;

  const newTask = await prisma.task.create({
    data: task,
  });
  return newTask;
}

export async function updateTask(task: Task) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const updatedTask = await prisma.task.update({
    where: {
      id: task.id,
    },
    data: task,
  });

  await prisma.activityFeed.create({
    data: {
      actorId: session.userId,
      objectType: Model.task,
      objectId: task.id,
      verb: Action.created,
      time: new Date(),
    }
  });
  return updatedTask;
}