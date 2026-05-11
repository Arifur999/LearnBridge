import { Route } from "@/types";
import { LayoutDashboard, Users } from "lucide-react";

export const moderatorRoutes: Route[] = [
  {
    title: "Content Moderation",
    url: "#",
    items: [
      { title: "Overview",            url: "/moderator/dashboard", icon: LayoutDashboard },
      { title: "User Access Control", url: "/moderator/users",     icon: Users },
    ],
  },
];
