"use server";

import { revalidatePath } from "next/cache";
import { enrollmentService } from "@/services/enrollment.service";

export const enrollCourseAction = async (courseId: string) => {
  if (!courseId) {
    return { success: false, message: "Course ID is required" };
  }

  try {
    const result = await enrollmentService.enrollCourse(courseId);

    revalidatePath("/student/courses");
    revalidatePath("/courses/[id]", "page");

    return {
      success: true,
      message: result?.message || "Enrollment successful!",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Enrollment failed",
    };
  }
};

export const getMyEnrollments = async () => {
  return await enrollmentService.getMyEnrollments();
};

