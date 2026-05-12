"use server";

import { revalidatePath } from "next/cache";
import { tutorService } from "@/services/tutor.service";
import { availabilityService } from "@/services/availability.service";

export async function getTutorCoursesAction() {
  return await tutorService.getMyCourses();
}

export async function createCourseAction(payload: {
  title: string;
  description: string;
  category: string;
  price?: number;
  image?: string;
}) {
  try {
    const result = await tutorService.createCourse(payload);
    revalidatePath("/tutor/courses");
    return { success: true, data: result };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function updateCourseAction(id: string, payload: {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string;
}) {
  try {
    const result = await tutorService.updateCourse(id, payload);
    revalidatePath("/tutor/courses");
    return { success: true, data: result };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    await tutorService.deleteCourse(id);
    revalidatePath("/tutor/courses");
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function updateTutorProfileAction(payload: {
  bio?: string;
  hourlyRate?: number;
  categoryId?: string;
  subjectIds?: string[];
  image?: string;
}) {
  try {
    const res = await tutorService.updateTutorProfile(payload);
    revalidatePath("/tutor/profile");
    return { success: true, data: res };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function createAvailabilityAction(data: {
  day: string;
  startTime: string;
  endTime: string;
}) {
  try {
    const res = await availabilityService.createAvailability(data);
    revalidatePath("/tutor/availability");
    return { success: true, data: res };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function updateAvailabilityAction(
  data: Partial<{ day: string; startTime: string; endTime: string }>,
  availabilityId: string
) {
  try {
    const res = await availabilityService.updateAvailability(availabilityId, data);
    return { success: true, data: res };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function deleteAvailabilityAction(availabilityId: string) {
  try {
    const res = await availabilityService.deleteAvailability(availabilityId);
    revalidatePath("/tutor/availability");
    return { success: true, data: res };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed" };
  }
}

export async function getTutorOverviewAction() {
  return await tutorService.getTutorOverview();
}

export async function getTutorMyBookingsAction(page = 1, limit = 20) {
  return await tutorService.getMyBookings(page, limit);
}
