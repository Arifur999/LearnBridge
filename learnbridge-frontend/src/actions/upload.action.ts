"use server";

import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "@/services/auth.server";

export async function uploadCourseImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return { success: false, message: "No file selected" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File must be under 5 MB" };
    }

    const { "Content-Type": _ct, ...headersWithoutContentType } =
      await getAuthHeaders();

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`${API_V1_URL}/upload/image`, {
      method: "POST",
      headers: headersWithoutContentType,
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data?.message ?? "Upload failed" };
    }
    return { success: true, url: data.url };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Upload failed",
    };
  }
}
