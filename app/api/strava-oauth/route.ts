import { redirect } from "next/navigation";

export async function GET(request: Request) {
    redirect(`https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&scope=read,activity:read&redirect_uri=http://localhost:3000/api/strava-callback&page=calendar`);
}