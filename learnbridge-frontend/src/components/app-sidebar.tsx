"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes } from "@/routes/adminRoutes";
import { tutorRoutes } from "@/routes/tutorRoutes";
import { studentRoutes } from "@/routes/studentRoutes";
import { instituteRoutes } from "@/routes/instituteRoutes";
import { mentorRoutes } from "@/routes/mentorRoutes";
import { moderatorRoutes } from "@/routes/moderatorRoutes";
import { NavUser } from "@/components/ui/nav-user";
import { Route, User } from "@/types";
import { Roles } from "@/constants/roles";

function getRoutes(role: string): Route[] {
  const r = role.toUpperCase();
  switch (r) {
    case Roles.admin:     return adminRoutes;
    case Roles.tutor:
    case "TRAINER":       return tutorRoutes;
    case Roles.institute: return instituteRoutes;
    case Roles.mentor:    return mentorRoutes;
    case Roles.moderator: return moderatorRoutes;
    default:              return studentRoutes;
  }
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  const role = user?.role ?? "student";
  const routes = getRoutes(role);
  const pathname = usePathname();

  const sidebarUser: User = {
    id: user?.id ?? "",
    name: user?.name ?? "User",
    email: user?.email ?? "",
    role: user?.role ?? "student",
    image: user?.image,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center px-1 py-2">
          <Image
            src="/logo.png"
            alt="LearnBridge"
            width={120}
            height={40}
            className="object-contain group-data-[collapsible=icon]:hidden"
          />
          {/* Collapsed: show small icon only */}
          <Image
            src="/logo.png"
            alt="LearnBridge"
            width={32}
            height={32}
            className="hidden object-contain group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          {Icon && <Icon className="size-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
