export enum UserRoles {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  INSTITUTE = "INSTITUTE",
  MENTOR = "MENTOR",
  MODERATOR = "MODERATOR",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export interface User {
  id:      string;
  name:    string;
  email:   string;
  image?:  string;
  role:    string;
  status?: string;
  tutor?:  TutorProfile;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  hourlyRate: number;
  avgRating: string;
  totalReviews: number;
  isFeatured: boolean;
  categoryId: string;
  category?: { id: string; name: string };
  subjects?: TutorSubject[];
  availability?: Availability[];
}

export interface TutorSubject {
  id: string;
  tutorId: string;
  subjectId: string;
  subject?: { id: string; name: string };
}

export interface TutorProfileDashboard {
  id: string;
  userId: string;
  bio: string;
  hourlyRate: number;
  avgRating: string;
  totalReviews: number;
  isFeatured: boolean;
}

export interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "BOOKED" | "AVAILABLE";
  tutorId: string;
}

export interface TutorFilterParams {
  search?: string;
  hourlyRate?: number;
  categoryId?: string;
  isFeatured?: boolean;
  avgRating?: number;
  page?: number;
  limit?: number;
}
