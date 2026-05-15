"use server";

import { courseService } from "@/services/course.service";

export const getPopularCourses = async (limit = 3) => {
  return await courseService.getPopularCourses(limit);
};

export const getAllCourses = async (query?: string) => {
  return await courseService.getAllCourses(query);
};

export const getAllTutors = async (query?: string) => {
  return await courseService.getAllTutors(query);
};

export const getCourseById = async (id: string) => {
  return await courseService.getCourseById(id);
};
export const getTrainerCoursesAction = async () => {
  return await courseService.getTrainerCourses();
};

export const getCategories = async () => {
  return await courseService.getCategories();
};
