import { getCookie } from "@/lib/cookiesUtils";

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const sessionToken = await getCookie("better-auth.session_token");

  return {
    "Content-Type": "application/json",
    ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
  };
};
