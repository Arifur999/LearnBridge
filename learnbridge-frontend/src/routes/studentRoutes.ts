import { Route } from "@/types";
import { LayoutDashboard, User, CalendarDays, BookOpen } from "lucide-react";

export const studentRoutes: Route[] = [
  {
    title: "Student Dashboard",
    url: "#",
    items: [
      { title: "Dashboard",   url: "/student",          icon: LayoutDashboard },
      { title: "My Profile",  url: "/student/profile",  icon: User },
      { title: "My Bookings", url: "/student/bookings", icon: CalendarDays },
      { title: "My Courses",  url: "/student/courses",  icon: BookOpen },
    ],
  },
];
