export interface InstituteProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string; image?: string };
}

export interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  specialization: string;
  instituteId: string;
  user: { name: string; email: string; image?: string };
}

export interface InstituteOverview {
  stats: {
    totalCourses: number;
    totalMentors: number;
    totalEnrollments: number;
    totalRevenue: number;
  };
  enrollmentsByCourse: { courseId: string; courseTitle: string; count: number }[];
  enrollmentsByLevel: { level: string; count: number }[];
  coursesByStatus: { status: string; count: number }[];
  enrollmentTrends: { month: string; count: number }[];
  recentCourses: { id: string; title: string; status: string; enrollments: number }[];
}
