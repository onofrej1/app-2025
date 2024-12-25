"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma";
import { signIn } from "@/auth";
import { RegisterUserType } from "@/validation";

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
