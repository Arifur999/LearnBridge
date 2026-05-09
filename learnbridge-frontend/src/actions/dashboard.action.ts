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
    const payload = {
      bio: formData.get("bio")?.toString() ?? "",
      subjects: formData.get("subjects")?.toString().trim() ?? "",
      hourlyRate: Number(formData.get("hourlyRate") || 0),
      category: formData.get("category")?.toString() ?? "",
      profileImage: formData.get("profileImage")?.toString() ?? undefined,
    };

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
