"use server";

import { revalidatePath } from "next/cache";
import { dashboardService } from "@/services/dashboard.service";

export const getStudentDashboard = async () => {
  return await dashboardService.getStudentDashboard();
};

export const getMyBookings = async () => {
  return await dashboardService.getMyBookings();
};

export const getAdminUsers = async () => {
  return await dashboardService.getAdminUsers();
};

export const getAdminBookings = async () => {
  return await dashboardService.getAdminBookings();
};

export const updateUserStatusAction = async (userId: string, status: string) => {
  try {
    const result = await dashboardService.updateUserStatus(userId, status);
    revalidatePath("/admin/users");
    return { success: true, message: "User status updated", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    };
  }
};

export const updateTutorProfileAction = async (formData: FormData) => {
  try {
    const payload = {
      bio: formData.get("bio")?.toString() ?? "",
      subjects: formData
        .get("subjects")
        ?.toString()
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean) ?? [],
      hourlyRate: Number(formData.get("hourlyRate") || 0),
      category: formData.get("category")?.toString() ?? "",
    };

    const result = await dashboardService.updateTutorProfile(payload);
    revalidatePath("/tutor/profile");
    return { success: true, message: "Profile saved", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
};

export const updateAvailabilityAction = async (formData: FormData) => {
  try {
    const payload = {
      date: formData.get("date")?.toString() ?? "",
      startTime: formData.get("startTime")?.toString() ?? "",
      endTime: formData.get("endTime")?.toString() ?? "",
    };

    const result = await dashboardService.updateTutorAvailability(payload);
    revalidatePath("/tutor/availability");
    return { success: true, message: "Availability saved", data: result };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to save availability",
    };
  }
};
