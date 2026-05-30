import { getCookie } from "@/lib/cookiesUtils";

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const sessionToken = await getCookie("better-auth.session_token");

  return {
    "Content-Type": "application/json",
    ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
  };
};
