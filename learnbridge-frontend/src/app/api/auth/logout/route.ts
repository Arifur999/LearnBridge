import { NextResponse } from "next/server";

const COOKIE_OPTIONS = { path: "/", maxAge: 0 };

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("accessToken", "", COOKIE_OPTIONS);
  response.cookies.set("authUser", "", COOKIE_OPTIONS);
  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("accessToken", "", COOKIE_OPTIONS);
  response.cookies.set("authUser", "", COOKIE_OPTIONS);
  return response;
}
