import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/utils/session";
import { cookies } from "next/headers";
import { githubOAuth } from "@/utils/oauth";
const crypto = require("crypto");

interface GithubProfile {
  id: string;
  name: string;
  avatar_url: string;
  login: string;    
}

export async function GET(request: Request) {
  const userInfoEndpoint = "https://api.github.com/user";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const params = {
    client_id: githubOAuth.client_id!,
    client_secret: githubOAuth.client_secret!,
    code: code!,
    redirect_uri: githubOAuth.redirect_uri!,
  };  

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
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
  console.log(profileResponse);
  if (!profileResponse.ok) {
    throw new Error("An error occured");
  }

  const profile: GithubProfile = await profileResponse.json();
  console.log(profile);  

  let user = await prisma.user.findFirst({
    where: {
      userName: profile.login,
    },
  });

  if (!user) {
    const pwd = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(pwd, Number(process.env.BCRYPT_SALT));
    const [firstName, lastName] = profile.name.split(' ');
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        userName: profile.login,
        role: "USER",
        status: 'ACTIVE',
        password: hash, // temporary, change to optional
        image: profile.avatar_url,
      },
    });
  } else {
    /*await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {    
      },
    });*/
  }

  let account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "GITHUB",
      providerAccountId: profile.id,
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        provider: "GITHUB",
        providerAccountId: profile.id,
        accessToken: data.access_token,
        /*refreshToken: data.refresh_token,
        expiresAt: data.expires_in,
        idToken: data.id_token,*/
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
        providerAccountId: profile.id,
        accessToken: data.access_token,
        /*refreshToken: data.refresh_token,
        expiresAt: data.expires_in,
        idToken: data.id_token,
        tokenType: data.token_type,
        */
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

  session.user = user.email! || session.user;
  session.userId = user.id;
  session.role = user.role;
  session.token = token;
  await session.save();

  redirect('/');
}
