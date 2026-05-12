import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  !!value && typeof value === "object" && !Array.isArray(value);

const asRecord = (value: unknown): ApiRecord => (isRecord(value) ? value : {});
const asString = (value: unknown) => (typeof value === "string" ? value : undefined);
const asNumber = (value: unknown) => (typeof value === "number" ? value : undefined);

const unwrapData = (value: unknown): unknown => {
  const root = asRecord(value);
  const data = root.data;
  const nestedData = asRecord(data).data;
  return nestedData ?? data ?? value;
};

const normalizeTutor = (value: unknown) => {
  const item = asRecord(value);
  const user = asRecord(item.user ?? item.User);
  // trainer nested object (present on course objects)
  const trainerObj = asRecord(item.trainer);
  const trainerUser = asRecord(trainerObj.user ?? trainerObj.User);
  const categoryRecord = asRecord(item.category);
  const subjects = Array.isArray(item.subjects) ? item.subjects : [];

  const name =
    asString(item.name) ??
    asString(user.name) ??
    asString(item.fullName) ??
    "Tutor";

  const id =
    asString(item.id) ??
    asString(item._id) ??
    asString(item.tutorProfileId) ??
    asString(user.id) ??
    name;

  const category =
    asString(categoryRecord.name) ??
    asString(item.category) ??
    asString(item.subject) ??
    asString(subjects[0] as unknown) ??
    "";

  // For courses: trainer.id is the actual trainer/tutor ID for booking
  const trainerId =
    asString(trainerObj.id) ??
    asString(item.trainerId) ??
    asString(trainerUser.id) ??
    id;

  const trainerName =
    asString(trainerObj.name) ??
    asString(trainerUser.name) ??
    name;

  return {
    ...item,
    id,
    title: asString(item.title) ?? name,
    description:
      asString(item.description) ??
      asString(item.bio) ??
      asString(item.about) ??
      (category ? `Expert tutor for ${category}` : "Expert tutor"),
    price:
      asNumber(item.price) ??
      asNumber(item.hourlyRate) ??
      asNumber(item.rate) ??
      asNumber(item.sessionFee),
    category,
    image: asString(item.image) ?? asString(item.thumbnail) ?? asString(item.coverImage),
    trainer: { id: trainerId, name: trainerName },
  };
};

const normalizeTutorListResponse = (result: unknown) => {
  const root = asRecord(result);
  const data = unwrapData(result);
  const dataRecord = asRecord(data);

  const list = Array.isArray(data)
    ? data
    : Array.isArray(dataRecord.tutors)
      ? dataRecord.tutors
      : Array.isArray(dataRecord.courses)
        ? dataRecord.courses
        : Array.isArray(dataRecord.items)
          ? dataRecord.items
          : Array.isArray(dataRecord.result)
            ? dataRecord.result
            : [];

  const rootData = asRecord(root.data);
  return {
    data: list.map(normalizeTutor),
    meta:
      root.meta ??
      rootData.meta ??
      rootData.pagination ??
      dataRecord.meta ??
      dataRecord.pagination ??
      null,
  };
};

class CourseService {
  async getPopularCourses(limit = 3) {
    // Try approved courses first, fall back to tutor profiles
    for (const path of [`/courses?limit=${limit}&status=APPROVED`, `/tutors?limit=${limit}`]) {
      try {
        const res = await fetch(`${API_V1_URL}${path}`, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const list = normalizeTutorListResponse(data).data;
        if (list.length > 0) return list;
      } catch { /* try next */ }
    }
    return [];
  }

  async getAllCourses(query = "") {
    // Try /courses (approved trainer courses) first, then /tutors (tutor profiles)
    const coursesQuery = query.includes("?")
      ? query + "&status=APPROVED"
      : query
        ? query + "&status=APPROVED"
        : "?status=APPROVED";

    for (const path of [`/courses${coursesQuery}`, `/courses${query}`, `/tutors${query}`]) {
      try {
        const res = await fetch(`${API_V1_URL}${path}`, { cache: "no-store" });
        if (!res.ok) continue;
        const result = await res.json();
        const normalized = normalizeTutorListResponse(result);
        if (normalized.data.length > 0) return normalized;
      } catch { /* try next */ }
    }
    return { data: [], meta: null };
  }

  async getCourseById(id: string) {
    // Try /courses/:id first (trainer course), then /tutors/:id (tutor profile)
    for (const path of [`/courses/${id}`, `/tutors/${id}`]) {
      try {
        const res = await fetch(`${API_V1_URL}${path}`, { cache: "no-store" });
        if (!res.ok) continue;
        const responseBody = await res.json();
        const item = unwrapData(responseBody);
        if (item) return normalizeTutor(item);
      } catch { /* try next */ }
    }
    return null;
  }

  async getTrainerCourses() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/tutor/profile`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return [];
      const result = await res.json();
      const data = unwrapData(result);
      return Array.isArray(data) ? data.map(normalizeTutor) : data ? [normalizeTutor(data)] : [];
    } catch {
      return [];
    }
  }

  async getCategories() {
    try {
      const res = await fetch(`${API_V1_URL}/categories`, { cache: "no-store" });
      if (!res.ok) return [];
      const result = await res.json();
      const data = unwrapData(result);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}

export const courseService = new CourseService();
