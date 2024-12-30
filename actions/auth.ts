"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { RegisterUserType } from "@/validation";
import bcrypt from "bcryptjs";

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
        role: "user",
      },
    });
  } catch (e) {
    console.log(e);
  }
  return { redirect: "/profile" };
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
    return { redirect: "/profile" };
  } catch (error: any) {
    if (error.code) {
      return { error: { path: "login", message: error.code } };
    }
  }
}

export async function signUserOut() {
  await signOut({ redirectTo: "/sign-in" });
}
