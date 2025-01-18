import { NextResponse } from "next/server";

export async function GET() {
  const token = "";

  const profile_response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const profile = await profile_response.json();
  console.log(profile);

  return NextResponse.json({ result: profile });
}
