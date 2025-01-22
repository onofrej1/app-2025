import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/utils/session";
import { cookies } from "next/headers";
import { googleOAuth } from "@/utils/oauth";
const crypto = require("crypto");

interface GoogleProfile {
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  id: string;
}

export async function GET(request: Request) {
  const userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const params = {
    client_id: googleOAuth.client_id,
    client_secret: googleOAuth.client_secret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: googleOAuth.redirect_uri,
  };

  const response = await fetch("https://accounts.google.com/o/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("An error occured");
  }

  const data = await response.json();
  console.log(data);

  const profileResponse = await fetch(userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error("An error occured");
  }

  const profile: GoogleProfile = await profileResponse.json();
  console.log(profile);

  let user = await prisma.user.findUnique({
    where: {
      email: profile.email,
    },
  });

  if (!user) {
    const pwd = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(pwd, Number(process.env.BCRYPT_SALT));

    user = await prisma.user.create({
      data: {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        role: "USER",
        status: "ACTIVE",
        password: hash, // temporary, change to optional
        image: profile.picture,
      },
    });
  } else {
    if (
      user.email !== profile.email ||
      user.firstName !== profile.given_name ||
      user.lastName !== profile.family_name ||
      user.image !== profile.picture
    ) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        },
      });
    }
  }

  let account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "GOOGLE",
      providerAccountId: profile.id,
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        provider: "GOOGLE",
        providerAccountId: profile.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in,
        idToken: data.id_token,
        tokenType: data.token_type,
        userId: user.id,
      },
    });
  } else {
    account = await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in,
        idToken: data.id_token,
      },
    });
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

  redirect("/");
}
