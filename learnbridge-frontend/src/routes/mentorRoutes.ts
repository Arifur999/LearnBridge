import { Route } from "@/types";
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react";

export const mentorRoutes: Route[] = [
  {
    title: "Mentor Tools",
    url: "#",
    items: [
      { title: "Overview",            url: "/mentor/dashboard", icon: LayoutDashboard },
      { title: "My Assigned Courses", url: "/mentor/courses",   icon: BookOpen },
      { title: "Student Rosters",     url: "/mentor/rosters",   icon: Users },
      { title: "Settings",            url: "/mentor/settings",  icon: Settings },
    ],
  },
];
