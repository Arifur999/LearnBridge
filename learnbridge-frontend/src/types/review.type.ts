export interface FullReview {
  id: string;
  bookingId: string;
  createdAt: string;
  rating: string;
  review: string;
  studentId: string;
  tutorId: string;
  student: { id: string; name: string; email: string; image?: string };
  tutor: { id: string; userId: string; bio: string; hourlyRate: number };
}

export interface Review {
  id: string;
  tutorId: string;
  reviewerId: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface LeaveReviewPayload {
  bookingId: string;
  rating: string;
  review: string;
}
