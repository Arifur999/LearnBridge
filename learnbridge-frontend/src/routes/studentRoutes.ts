import { Route } from "@/types";
import { LayoutDashboard, User, CalendarDays, BookOpen, CreditCard } from "lucide-react";

export const studentRoutes: Route[] = [
  {
    title: "Student Dashboard",
    url: "#",
    items: [
      { title: "Dashboard",       url: "/dashboard",          icon: LayoutDashboard },
      { title: "My Profile",      url: "/dashboard/profile",  icon: User },
      { title: "My Bookings",     url: "/dashboard/bookings", icon: CalendarDays },
      { title: "My Courses",      url: "/dashboard/courses",  icon: BookOpen },
      { title: "Payment History", url: "/dashboard/payments", icon: CreditCard },
    ],
  },
];
