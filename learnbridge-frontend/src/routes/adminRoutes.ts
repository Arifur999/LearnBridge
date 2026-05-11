import { Route } from "@/types";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ClipboardList,
  CreditCard,
  Layers,
  Award,
} from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Platform Management",
    url: "#",
    items: [
      { title: "Analytics",           url: "/admin/analytics",  icon: LayoutDashboard },
      { title: "User Management",     url: "/admin/users",      icon: Users },
      { title: "Moderators",          url: "/admin/moderators", icon: ShieldCheck },
      { title: "All Bookings",        url: "/admin/bookings",   icon: ClipboardList },
      { title: "Payments",            url: "/admin/payments",   icon: CreditCard },
      { title: "Category & Subjects", url: "/admin/categories", icon: Layers },
      { title: "Featured Tutors",     url: "/admin/featured",   icon: Award },
    ],
  },
];
