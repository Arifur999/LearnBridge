export * from "./routes.type";
export * from "./user.type";
export * from "./availability.type";
export * from "./booking.type";
export * from "./tutor.type";
export * from "./review.type";
export * from "./course.type";
export * from "./institute.type";

export interface Subject {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
  createdAt: string;
}

export interface TutorOverviewData {
  profile: {
    bio: string;
    hourlyRate: number;
    avgRating: string;
    isFeatured: boolean;
    category: Category;
    subjects: Subject[];
  };
  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    upcomingBookings: number;
    totalEarnings: number;
  };
  upcomingBookings: import("./booking.type").Booking[];
  recentReviews: import("./review.type").Review[];
  availability: import("./availability.type").AvailabilityData[];
}

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: import("lucide-react").LucideIcon;
  items?: MenuItem[];
}

export interface Mentor {
  id: string;
  user: {
    name: string;
    image: string | null;
  };
}

export interface ListUserPaginationProps {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  bookingId?: string;
  courseId?: string;
  userId: string;
  user?: { name: string; email: string };
}
