import { API_BASE_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

export interface CreateSlotPayload {
  courseId: string; // Jodi specific course er jonno hoy, noile optional
  startTime: string; // Format: "10:00"
  endTime: string;   
  date: string;      
}

export const createSlotService = async (payload: CreateSlotPayload) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/v1/slots`, {
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