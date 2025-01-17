'use server'

import { SessionData, sessionOptions } from "@/utils/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

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