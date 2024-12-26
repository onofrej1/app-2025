"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma";
import { signIn } from "@/auth";
import { RegisterUserType } from "@/validation";
import { prismaQuery } from "@/db";
import { Resource } from "@/resources/resources.types";
import { redirect } from 'next/navigation'
 
export async function navigate(path: string) {
  return redirect(path);
}

export async function addResource (resource: Resource, data: any) {
  const form = resource.form;
  form.forEach(field => {
    if (field.type === 'fk') {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }

    if (field.type === 'm2m') {
      const values = data[field.name].filter(Boolean).map((value: any) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
    }
  });
  const args: any = {
    data
  };

  await prismaQuery(resource.model, 'create', args);

  return { redirect: `/resource/${resource.resource}` };
}

export async function updateResource(resource: Resource, parsedData: any) {
  const { id, ...data } = parsedData;
  const form = resource.form;
  for (const field of form) {
    if (field.type === 'fk') {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }
    if (field.type === 'm2m') {
      const args: any = {
        data: { [field.name]: { set: [] } },
        where: { id: Number(id) }
      }
      await prismaQuery(resource.model, 'update', args);
      console.log(data);
      console.log(data[field.name]);
      const values = data[field.name].filter(Boolean).map((value: any) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
      console.log(data);
    }
  }
  const args: any = {
    data,
    where: { id: Number(id) }
  }
  await prismaQuery(resource.model, 'update', args);

  return { redirect: `/resource/${resource.resource}` };
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

export async function registerUser(data: RegisterUserType) {
  const { name, email, password } = data;

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    throw new Error("Email already exists");
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
