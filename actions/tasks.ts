"use server";

import { prisma } from "@/db/prisma";
import { Task } from "@prisma/client";

export async function getTasks() {
  return prisma.task.findMany();
}

export async function updateTask(task: Task) {
  const tasks = await prisma.task.update({
    where: {
      id: task.id,
    },
    data: task,
  });
  return tasks;
}
