import { cookies } from "next/headers";

const TOKEN_KEY = "accessToken";

export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};