"use server";
import { setCookie } from "./cookiesUtils";

// BetterAuth session token has no JWT exp — use fixed maxAge
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const setSessionTokenInCookies = async (token: string) => {
  await setCookie("better-auth.session_token", token, SESSION_MAX_AGE);
};
