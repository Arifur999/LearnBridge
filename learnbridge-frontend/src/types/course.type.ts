export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  thumbnailUrl?: string;
  duration?: number;
  categoryId?: string;
  category?: { id: string; name: string };
  mentor?: { user: { name: string; image?: string } };
  institute?: { name: string };
  _count?: { enrollments: number };
  createdAt: string;
  status?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  course?: Course;
  student?: { id: string; name: string; email: string };
}
