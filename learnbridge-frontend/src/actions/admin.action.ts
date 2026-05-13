"use server";

import { categoryService } from "@/services/category.service";
import { tutorService } from "@/services/tutor.service";
import { userService } from "@/services/user.service";
import { Category, Subject } from "@/types";
import { revalidatePath } from "next/cache";

export const createCategoryAction = async (categoryData: Partial<Category>) => {
  try {
    const res = await categoryService.createCategory({
      name: categoryData.name ?? "",
      description: categoryData.description,
    });
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateCategoryAction = async (
  categoryData: Partial<Category>,
  categoryId: string
) => {
  try {
    const res = await categoryService.updateCategory(categoryId, {
      name: categoryData.name,
      description: categoryData.description,
    });
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const deleteCategoryAction = async (categoryId: string) => {
  try {
    const res = await categoryService.deleteCategory(categoryId);
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const createSubjectAction = async (subjectData: Partial<Subject>) => {
  try {
    const res = await categoryService.createSubject(
      subjectData.categoryId ?? "",
      { name: subjectData.name ?? "" }
    );
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateSubjectAction = async (
  subjectData: Partial<Subject>,
  subjectId: string
) => {
  try {
    const res = await categoryService.updateSubject(subjectId, {
      name: subjectData.name,
      categoryId: subjectData.categoryId,
    });
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const deleteSubjectAction = async (subjectId: string) => {
  try {
    const res = await categoryService.deleteSubject(subjectId);
    revalidatePath("/admin/categories");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateFeaturedTutorAction = async (
  isFeatured: boolean,
  tutorId: string
) => {
  try {
    const res = await tutorService.updateFeaturedTutor(tutorId, isFeatured);
    revalidatePath("/admin/featured");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const inviteModeratorAction = async (email: string, name?: string) => {
  try {
    const res = await userService.inviteModerator(email, name);
    return { success: true, data: res, message: "Invitation sent" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to invite moderator" };
  }
};

export const updateUserStatusAction = async (
  status: string,
  userId: string
) => {
  try {
    const res = await userService.updateUserStatus(userId, status);
    revalidatePath("/admin/users");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const getAdminAnalyticsAction = async () => {
  try {
    const res = await userService.getAdminAnalytics();
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};
