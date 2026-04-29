/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sidebarRightKey = "sidebar-right" as const;

/**
 * Translation namespace — `useTranslations(sidebarRightNamespace)` resolves keys from `en.json`.
 */
export const sidebarRightNamespace = "blocks.sidebar-right" as const;

export type SidebarRightData = {
  user: { name: string; email: string; avatar: string };
  /**
   * Calendar groups — names and items are demo content kept in config.ts so
   * forks can swap them without touching translations. `active` is the set
   * of items currently checked.
   */
  calendars: { name: string; items: string[]; active?: readonly string[] }[];
};

export const sidebarRightData: SidebarRightData = {
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
