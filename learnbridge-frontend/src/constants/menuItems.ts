export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  items?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { title: "Browse Tutors", url: "/tutors" },
  { title: "Courses", url: "/courses" },
  { title: "About Us", url: "/about" },
];
