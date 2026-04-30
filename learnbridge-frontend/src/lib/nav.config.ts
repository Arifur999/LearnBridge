import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  PlusCircle,
  User,
  Tags
} from "lucide-react";

export type UserRole = "admin" | "trainer" | "tutor" | "student";

export const navConfig = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Bookings", url: "/admin/bookings", icon: Calendar },
    { title: "Categories", url: "/admin/categories", icon: Tags },
  ],
  trainer: [
    { title: "Dashboard", url: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "Availability", url: "/tutor/availability", icon: PlusCircle },
    { title: "Profile", url: "/tutor/profile", icon: User },
  ],
  tutor: [
    { title: "Dashboard", url: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "Availability", url: "/tutor/availability", icon: PlusCircle },
    { title: "Profile", url: "/tutor/profile", icon: User },
  ],
  student: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "My Bookings", url: "/student/bookings", icon: Calendar },
    { title: "Browse Tutors", url: "/tutors", icon: BookOpen },
    { title: "Profile", url: "/student/profile", icon: User },
  ],
};
