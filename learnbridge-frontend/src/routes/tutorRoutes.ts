import { Route } from "@/types";
import { LayoutDashboard, CalendarDays, CreditCard, User, Star, Clock, BookOpen } from "lucide-react";

export const tutorRoutes: Route[] = [
  {
    title: "Tutor Panel",
    url: "#",
    items: [
      { title: "Overview",     url: "/tutor/dashboard",    icon: LayoutDashboard },
      { title: "My Courses",   url: "/tutor/courses",      icon: BookOpen },
      { title: "My Bookings",  url: "/tutor/bookings",     icon: CalendarDays },
      { title: "Availability", url: "/tutor/availability", icon: Clock },
      { title: "Payments",     url: "/tutor/payments",     icon: CreditCard },
      { title: "My Profile",   url: "/tutor/profile",      icon: User },
      { title: "Reviews",      url: "/tutor/reviews",      icon: Star },
    ],
  },
];
