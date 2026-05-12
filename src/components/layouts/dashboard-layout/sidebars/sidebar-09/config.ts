export const sidebar09Key = "sidebar-09" as const;

export const sidebar09Namespace = "blocks.sidebar-09" as const;

export type SidebarData = {
  user: { name: string; email: string; avatar: string };

  calendars: { name: string; items: string[]; active?: readonly string[] }[];
};

export const sidebar09Data: SidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
      active: ["Personal", "Work"],
    },
    { name: "Favorites", items: ["Holidays", "Birthdays"] },
    { name: "Other", items: ["Travel", "Reminders", "Deadlines"] },
  ],
};
