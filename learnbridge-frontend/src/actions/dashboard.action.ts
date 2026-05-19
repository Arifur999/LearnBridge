"use server";

import { revalidatePath } from "next/cache";
import { dashboardService } from "@/services/dashboard.service";
import { bookingService } from "@/services/booking.service";

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

export const updateTutorProfileAction = async (
  _prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const rawSubjects = formData.get("subjects")?.toString().trim() ?? "";
    // Backend stores subjects as a comma-separated string
    const subjectsStr = rawSubjects
      .split(",").map((s) => s.trim()).filter(Boolean).join(", ");

    const categoryRaw = formData.get("category")?.toString() ?? "";
    const profileImage = formData.get("profileImage")?.toString() || undefined;

    const hourlyRate = Number(formData.get("hourlyRate") || 0);
    const bio = formData.get("bio")?.toString().trim() ?? "";

    const payload: Record<string, unknown> = {};

    if (bio) payload.bio = bio;
    if (hourlyRate > 0) payload.hourlyRate = hourlyRate;
    if (subjectsStr) payload.subjects = subjectsStr;
    if (categoryRaw) payload.category = categoryRaw;
    if (profileImage) payload.profileImage = profileImage;

    await dashboardService.updateTutorProfile(payload);
    revalidatePath("/tutor/profile");
    return { success: true, message: "Profile saved successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
};

export const getTutorProfileAction = async () => {
  return await dashboardService.getTutorProfile();
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

export const getTutorSlotsAction = async () => {
  return await dashboardService.getTutorSlots();
};

export const cancelBookingAction = async (bookingId: string) => {
  try {
    const result = await bookingService.cancelBooking(bookingId);
    revalidatePath("/student/bookings");
    revalidatePath("/tutor/dashboard");
    return { success: true, message: "Booking cancelled", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel booking",
    };
  }
};

export const completeBookingAction = async (bookingId: string) => {
  try {
    const result = await bookingService.completeBooking(bookingId);
    revalidatePath("/tutor/dashboard");
    revalidatePath("/student/bookings");
    return { success: true, message: "Session marked complete", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to complete booking",
    };
  }
};

// Tutor Dashboard Actions
export const getTutorDashboard = async () => {
  return await dashboardService.getTutorDashboard();
};

export const getTutorBookings = async () => {
  return await dashboardService.getTutorBookings();
};

export const getTutorCourses = async () => {
  return await dashboardService.getTutorCourses();
};

// Admin Dashboard Actions
export const getAdminDashboard = async () => {
  return await dashboardService.getAdminDashboard();
};

export const getCategories = async () => {
  return await dashboardService.getCategories();
};

export const createCategoryAction = async (formData: FormData) => {
  try {
    const result = await dashboardService.createCategory({
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
    });
    revalidatePath("/admin/categories");
    return { success: true, message: "Category created", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
};

export const deleteCategoryAction = async (categoryId: string) => {
  try {
    await dashboardService.deleteCategory(categoryId);
    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
};

export const getAdminCoursesAction = async () => {
  return await dashboardService.getAdminCourses();
};

export const getAdminPendingCoursesAction = async () => {
  return await dashboardService.getAdminPendingCourses();
};

export const approveCourseAction = async (courseId: string) => {
  try {
    await dashboardService.approveCourse(courseId);
    revalidatePath("/admin/courses");
    return { success: true, message: "Course approved" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed" };
  }
};

export const rejectCourseAction = async (courseId: string) => {
  try {
    await dashboardService.rejectCourse(courseId);
    revalidatePath("/admin/courses");
    return { success: true, message: "Course rejected" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateUserProfileAction = async (payload: {
  name?: string;
  image?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = await import("@/services/auth.server").then((m) =>
      m.getAuthHeaders()
    );
    const { API_V1_URL } = await import("@/lib/config");
    const res = await fetch(`${API_V1_URL}/auth/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    revalidatePath("/dashboard/profile");
    revalidatePath("/tutor/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
