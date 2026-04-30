export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const API_V1_URL = API_BASE_URL.replace(/\/$/, "").endsWith("/api/v1")
  ? API_BASE_URL.replace(/\/$/, "")
  : `${API_BASE_URL.replace(/\/$/, "")}/api/v1`;
