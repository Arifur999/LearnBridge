import { NextResponse } from "next/server";
import { getCurrentUserFromServer } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserFromServer();
  return NextResponse.json({ user });
}
