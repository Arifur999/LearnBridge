import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

export interface CreateSlotPayload {
  courseId?: string;
  startTime: string; // Format: "10:00"
  endTime: string;   
  date: string;      
}

export const createSlotService = async (payload: CreateSlotPayload) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_V1_URL}/slots`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to create slot");
  }

  return data;
};
