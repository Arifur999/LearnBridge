"use server";

import { mentorService } from "@/services/mentor.service";
import { revalidatePath } from "next/cache";

export const getMentorOverviewAction = async () => {
  return await mentorService.getOverview();
};

export const getAssignedCoursesAction = async () => {
  return await mentorService.getAssignedCourses();
};

export const getCourseRosterAction = async (courseId: string) => {
  return await mentorService.getCourseRoster(courseId);
};

export const getMentorProfileAction = async () => {
  return await mentorService.getProfile();
};

export const updateMentorProfileAction = async (payload: {
  bio?: string;
  specialization?: string;
  image?: string;
}) => {
  try {
    const res = await mentorService.updateProfile(payload);
    revalidatePath("/mentor/settings");
    return { success: true, data: res };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update profile" };
  }
};

export const getMentorStudentsAction = async () => {
  return await mentorService.getStudents();
};
