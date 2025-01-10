"use server";

import { prisma } from "@/db/prisma";
import { RegisterUserType } from "@/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SessionData, sessionOptions } from "@/utils/session";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/utils/email";
const crypto = require("crypto");

export async function isAuthenticated() {
  const session = await getSession();
  if (!session || !session.token) {
    return false;
  }
  return true;
}

export async function getSessionToken() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return {
    token: session.token,
    role: session.role,
  };
}

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session || !session.token || !session.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    return null;
  }

  const userSession = await prisma.session.findFirst({
    where: {
      userId: session.userId,
      sessionToken: session.token,
    },
  });

  if (!userSession) {
    return null;
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

  const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT!);

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

export async function SignInUser(data: { email: string; password: string }) {
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
    throw new Error("Invalid credentials");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = uuidv4();
  await prisma.session.create({
    data: {
      userId: user?.id,
      expires: new Date(2025, 11, 11),
      sessionToken: token,
    },
  });

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.user = user.email!;
  session.userId = user.id;
  session.role = user.role;
  session.token = token;
  await session.save();

  return user;
}

export async function signUserOut() {
  const session = await getSession();
  if (session) {
    await prisma.session.delete({
      where: {
        userId: session.userId,
        sessionToken: session.token!,
      },
    });
    session.destroy();
  }
}

export async function resetPasswordRequest(email: string) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new Error("User does not exist");
  }
  const token = await prisma.resetToken.findFirst({
    where: { userId: user.id },
  });
  if (token) {
    await prisma.resetToken.delete({ where: { id: token.id } });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

  await prisma.resetToken.create({
    data: {
      userId: user.id,
      token: hash,
    },
  });

  const link = `${process.env.BASE_URL}/reset-password?token=${resetToken}&id=${user.id}`;

  sendEmail(
    user.email,
    "Password Reset Request",
    "requestResetPassword.handlebars",
    { name: user.name, link: link }
  );
}

export async function ResetPassword(
  userId: string,
  token: string,
  password: string
) {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) {
    throw new Error("User does not exist");
  }
  const resetToken = await prisma.resetToken.findFirst({
    where: {
      userId,
    },
  });
  if (!resetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, resetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
  await prisma.user.update({
    data: {
      password: hash,
    },
    where: {
      id: userId,
    },
  });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    "resetPassword.handlebars",
    {
      name: user.id,
    }
  );
  await prisma.resetToken.delete({ where: { id: resetToken.id } });
}
