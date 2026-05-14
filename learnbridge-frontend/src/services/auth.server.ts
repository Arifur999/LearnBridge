import { cookies } from "next/headers";

const TOKEN_KEY = "accessToken";

export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(TOKEN_KEY)?.value;
  const token = rawToken?.startsWith("Bearer ") ? rawToken : rawToken ? `Bearer ${rawToken}` : "";

  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
};
