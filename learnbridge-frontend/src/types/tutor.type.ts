export interface TutorForModal {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  categoryId: string;
  category: { id: string; name: string; description?: string };
  bio: string;
  hourlyRate: number;
  avgRating: string;
  totalReviews: number;
  isFeatured: boolean;
  subjects: { id: string; tutorId: string; subjectId: string; subject?: { id: string; name: string } }[];
  availability: { id: string; day: string; startTime: string; endTime: string; status: string; tutorId: string }[];
  reviews: { id: string; rating: number; review: string; createdAt: string }[];
  createdAt: string;
}
