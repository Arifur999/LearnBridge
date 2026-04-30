import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asRecord = (value: unknown): ApiRecord => isRecord(value) ? value : {};

const asString = (value: unknown) => typeof value === "string" ? value : undefined;

const asNumber = (value: unknown) => typeof value === "number" ? value : undefined;

const unwrapData = (value: unknown): unknown => {
  const root = asRecord(value);
  const data = root.data;
  const nestedData = asRecord(data).data;
  return nestedData ?? data ?? value;
};

const normalizeTutor = (value: unknown) => {
  const tutor = asRecord(value);
  const user = asRecord(tutor.user ?? tutor.User);
  const categoryRecord = asRecord(tutor.category);
  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : [];
  const name =
    asString(tutor.name) ??
    asString(user.name) ??
    asString(tutor.fullName) ??
    "Tutor";
  const id =
    asString(tutor.id) ??
    asString(tutor._id) ??
    asString(tutor.tutorProfileId) ??
    asString(user.id) ??
    name;
  const category =
    asString(categoryRecord.name) ??
    asString(tutor.category) ??
    asString(tutor.subject) ??
    asString(subjects[0]) ??
    "";

  return {
    ...tutor,
    id,
    title: asString(tutor.title) ?? name,
    description:
      asString(tutor.description) ??
      asString(tutor.bio) ??
      asString(tutor.about) ??
      (category ? `Expert tutor for ${category}` : "Expert tutor"),
    price:
      asNumber(tutor.price) ??
      asNumber(tutor.hourlyRate) ??
      asNumber(tutor.rate) ??
      asNumber(tutor.sessionFee),
    category,
    trainer: {
      id,
      name,
    },
  };
};

const normalizeTutorListResponse = (result: unknown) => {
  const root = asRecord(result);
  const data = unwrapData(result);
  const dataRecord = asRecord(data);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(dataRecord.items)
      ? dataRecord.items
      : Array.isArray(dataRecord.result)
        ? dataRecord.result
        : [];

  return {
    data: list.map(normalizeTutor),
    meta: root.meta ?? asRecord(root.data).meta ?? dataRecord.meta ?? null,
  };
};

class CourseService {
  async getPopularCourses(limit = 3) {
    try {
      const res = await fetch(
        `${API_V1_URL}/tutors?limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        console.error("Course API failed:", res.status);
        return [];
      }

      const data = await res.json();
      return normalizeTutorListResponse(data).data;
    } catch (error) {
      console.error("Course fetch error:", error);
      return [];
    }
  }

 
  async getAllCourses(query = "") {
    try {
      const res = await fetch(
        `${API_V1_URL}/tutors${query}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        return { data: [], meta: null };
      }

      const result = await res.json();

      return normalizeTutorListResponse(result);
    } catch (error) {
      console.error("Course fetch error:", error);
      return { data: [], meta: null };
    }
  }


  async getCourseById(id: string) {
    try {
      const res = await fetch(
        `${API_V1_URL}/tutors/${id}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        return null;
      }

      const responseBody = await res.json();

      const tutor = unwrapData(responseBody);
      return tutor ? normalizeTutor(tutor) : null;

    } catch {
      return null;
    }
  }



  async getTrainerCourses() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/tutor/profile`, {
        method: "GET",
        headers: headers,
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to fetch trainer courses:", res.status);
        return [];
      }

      const result = await res.json();
      const data = unwrapData(result);
      return Array.isArray(data) ? data.map(normalizeTutor) : data ? [normalizeTutor(data)] : [];
    } catch (error) {
      console.error("Trainer courses fetch error:", error);
      return [];
    }
  }

  async getCategories() {
    try {
      const res = await fetch(`${API_V1_URL}/categories`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return [];
      }

      const result = await res.json();
      const data = unwrapData(result);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Categories fetch error:", error);
      return [];
    }
  }

}




export const courseService = new CourseService();
