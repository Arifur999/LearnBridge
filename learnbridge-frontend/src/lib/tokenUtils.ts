"use server";
import { setCookie } from "./cookiesUtils";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export const setSessionTokenInCookies = async (token: string) => {
  await setCookie("better-auth.session_token", token, SESSION_MAX_AGE);
};
