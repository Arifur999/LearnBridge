"use server";

import { courseService } from "@/services/course.service";

export const getPopularCourses = async (limit = 3) => {
  return await courseService.getPopularCourses(limit);
};

export const getAllCourses = async (query?: string) => {
  return await courseService.getAllCourses(query);
};

export const getCourseById = async (id: string) => {
  return await courseService.getCourseById(id);
};
