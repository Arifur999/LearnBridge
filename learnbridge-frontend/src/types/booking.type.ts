export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  price: number;
  status: BookingStatus;
  availabilityId: string | null;
  tutor?: {
    id: string;
    userId: string;
    bio: string;
    hourlyRate: number;
    avgRating: string;
    user?: { name: string; email: string; image?: string };
  };
  student: { id: string; name: string; email: string; image?: string };
  availability: { id: string; day: string; startTime: string; endTime: string; status: string; tutorId: string };
  completedAt: string | null;
  createdAt?: string;
}

export interface AdminBooking extends Booking {}

export interface BookingDetail extends Booking {
  subjectId: string;
  subject?: { id: string; name: string };
  review: { rating: string; review: string } | null;
}

export interface CreateBookingPayload {
  tutorId: string;
  availabilityId: string;
  subjectId: string;
}
