"use server";

import { revalidatePath } from "next/cache";
import { tutorService } from "@/services/tutor.service";

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
