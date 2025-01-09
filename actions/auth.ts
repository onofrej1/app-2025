"use server";

import { prisma } from "@/db/prisma";
import { RegisterUserType } from "@/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { defaultSession, SessionData, sessionOptions } from "@/utils/session";

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.destroy();
    return session;
    //session.user = null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,      
    },
  });

  const userSession = await prisma.session.findFirst({
    where: {
      userId: session.userId,
      // sessionToken: session.token;
    },
  });

  if (!user || !userSession) {
    throw new Error('Unauthorized');
  }

  return session;
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
        role: "user",
      },
    });
  } catch (e) {
    console.log(e);
  }
  return { redirect: "/profile" };
}

export async function SignInUser(data: {
  email: string,
  password: string
}) {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("Please enter an email and password");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });  

  if (!user || !user?.password) {
    throw new Error('Invalid credentials');
  }
  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  await prisma.session.create({
    data: {
      userId: user?.id,
      expires: new Date(2025, 11, 11),
      sessionToken: 'test',
    }
  });

  //user.role = "test";
  console.log(user);

  const session = await getSession();

  session.user = user.email || user.id;
  session.userId = user.id;
  session.role = user.role;
  session.isLoggedIn = true;
  await session.save();

  return user;
}

export async function signUserOut() {
  const session = await getSession();
  session.destroy();
}
