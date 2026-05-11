import { Route } from "@/types";
import { LayoutDashboard, BookOpen, Users, Star, CreditCard, User, GraduationCap } from "lucide-react";

export const instituteRoutes: Route[] = [
  {
    title: "Institute Management",
    url: "#",
    items: [
      { title: "Overview",  url: "/institute/dashboard", icon: LayoutDashboard },
      { title: "Courses",   url: "/institute/courses",   icon: BookOpen },
      { title: "Mentors",   url: "/institute/mentors",   icon: Users },
      { title: "Students",  url: "/institute/students",  icon: GraduationCap },
      { title: "Reviews",   url: "/institute/reviews",   icon: Star },
      { title: "Payments",  url: "/institute/payments",  icon: CreditCard },
      { title: "Profile",   url: "/institute/profile",   icon: User },
    ],
  },
];
