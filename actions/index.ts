"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma";
import { signIn } from "@/auth";
import { RegisterUserType } from "@/validation";
import { prismaQuery } from "@/db";
import { Resource } from "@/resources/resources.types";
import { redirect } from "next/navigation";
import path from "node:path";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { Prisma, Task } from "@prisma/client";
const fs = require("fs").promises;

export async function deleteFile(file: { path: string; name: string }) {
  const f = await fs.readFile(file.path + "/" + file.name);
  if (f) {
    //fs.unlink(file.path + "/" + file.name);
  }
  return "done";
}

export async function readDirectory() {
  const f = await fs.readdir("./public/assets", { withFileTypes: true });
  const data = [];
  for (const file of f) {
    const f = await fs.readFile(file.path + "/" + file.name, {
      encoding: "base64",
    });
    data.push({
      src: f,
      name: file.name,
      path: file.path,
    });
  }
  return data;
}

export async function navigate(path: string) {
  return redirect(path);
}

export async function addResource(resource: Resource, data: any) {
  const form = resource.form;
  form.forEach((field) => {
    if (field.type === "fk") {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }

    if (field.type === "m2m") {
      const values = data[field.name]
        .filter(Boolean)
        .map((value: any) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
    }
  });
  const args: any = {
    data,
  };

  await prismaQuery(resource.model, "create", args);

  return { redirect: `/resource/${resource.resource}` };
}

export async function updateResource(resource: Resource, parsedData: any) {
  const { id, ...data } = parsedData;
  const form = resource.form;
  for (const field of form) {
    if (field.type === "fk") {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }
    if (field.type === "m2m") {
      const args: any = {
        data: { [field.name]: { set: [] } },
        where: { id: Number(id) },
      };
      await prismaQuery(resource.model, "update", args);
      const values = data[field.name]
        .filter(Boolean)
        .map((value: any) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
    }
  }
  const args: any = {
    data,
    where: { id: Number(id) },
  };
  await prismaQuery(resource.model, "update", args);

  return { redirect: `/resource/${resource.resource}` };
}

export async function DeleteResource(resource: Resource, id: string) {
  const args = {
    where: {
      id: Number(id),
    },
  };
  await prismaQuery(resource.model, "delete", args);
  const resourcePath = `resources/${resource.resource}`;
  revalidatePath(resourcePath);
  return { message: "Item successfully deleted." };
}

export async function SignInUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
    return { redirect: "/home" };
  } catch (error: any) {
    if (error.code) {
      return { error: { path: "login", message: error.code } };
    }
  }
}

export async function getTasks() {
  return prisma.task.findMany();  
}

export async function getEvents() {
  return prisma.event.findMany();  
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

export async function registerUser(data: RegisterUserType) {
  const { name, email, password } = data;

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    return { error: { path: "email", message: "Email already exists" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email: email,
        password: hashedPassword,
        //role: 'user'
      },
    });
  } catch (e) {
    console.log(e);
  }
  return { redirect: "/home" };
}

export async function uploadFiles(formData: FormData, uploadDir = null) {
  const count = formData.get("count");
  const dir = uploadDir ?? "public/assets/";

  for (let i = 0; i < Number(count); i++) {
    const file = formData.get("file-" + i) as File;
    if (!file) {
      throw new Error("An error occured");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");

    try {
      await writeFile(path.join(process.cwd(), dir + filename), buffer);
    } catch (error) {
      console.log("Error occured ", error);
      throw error;
    }
  }
}
