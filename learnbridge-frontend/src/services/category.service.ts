import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class CategoryService {
  async getAllCategories() {
    try {
      const res = await fetch(`${API_V1_URL}/categories`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      const raw = data?.data ?? data;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  async createCategory(payload: { name: string; description?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Create failed");
    return data;
  }

  async updateCategory(id: string, payload: { name?: string; description?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async deleteCategory(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/categories/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Delete failed");
    return data;
  }

  async createSubject(categoryId: string, payload: { name: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/categories/${categoryId}/subjects`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Create failed");
    return data;
  }

  async updateSubject(subjectId: string, payload: { name?: string; categoryId?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/subjects/${subjectId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async deleteSubject(subjectId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/subjects/${subjectId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Delete failed");
    return data;
  }
}

export const categoryService = new CategoryService();
