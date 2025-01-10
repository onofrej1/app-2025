
//import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "./actions/auth";

// Define role-based access control
const adminRoutes = ["/admin", "/settings"];
const editorRoutes = ["/edit", "/runs"];

export async function middleware(req: NextRequest) {
  const session = await getSessionToken(); //await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session || !session.token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (adminRoutes.includes(req.nextUrl.pathname) && session.role !== "admin") {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  if (editorRoutes.includes(req.nextUrl.pathname) && session.role !== "user") {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  // If everything checks out, proceed
  return NextResponse.next();
}

// Specify the routes that require the middleware
export const config = {
  matcher: ["/admin/:path*", "/runs"],
};
