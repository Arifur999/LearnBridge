"use server";

import { instituteService } from "@/services/institute.service";
import { revalidatePath } from "next/cache";

export const createCourseAction = async (formData: FormData) => {
  const res = await instituteService.createCourse(formData);
  revalidatePath("/institute/courses");
  return res;
};

export const updateCourseAction = async (courseId: string, formData: FormData) => {
  const res = await instituteService.updateCourse(courseId, formData);
  revalidatePath("/institute/courses");
  return res;
};

export const deleteCourseAction = async (courseId: string) => {
  const res = await instituteService.deleteCourse(courseId);
  revalidatePath("/institute/courses");
  return res;
};

export const inviteMentorAction = async (email: string) => {
  try {
    const res = await instituteService.inviteMentor(email);
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateInstituteProfileAction = async (payload: {
  name?: string;
  description?: string;
  logo?: string;
}) => {
  try {
    const res = await instituteService.updateProfile(payload);
    revalidatePath("/institute/profile");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};
