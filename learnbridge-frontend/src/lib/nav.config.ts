import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  PlusCircle
} from "lucide-react";

export type UserRole = "admin" | "trainer" | "student";

export const navConfig = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Users", url: "/admin/users", icon: Users },
    { title: "All Courses", url: "/admin/courses", icon: BookOpen },
  ],
  trainer: [
    { title: "Dashboard", url: "/trainer", icon: LayoutDashboard },
    { title: "My Courses", url: "/trainer/courses", icon: BookOpen },
    { title: "Create Slot", url: "/trainer/add-slot", icon: PlusCircle },
  ],
  student: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "My Bookings", url: "/student/bookings", icon: Calendar },
    { title: "Enrolled Courses", url: "/student/courses", icon: BookOpen },
  ],
};