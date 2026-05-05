import type { ComponentType, ElementType } from "react";
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sidebar08Key = "sidebar-08" as const;

/**
 * Translation namespace — `useTranslations(sidebar08Namespace)` resolves keys from `en.json`.
 */
export const sidebar08Namespace = "blocks.sidebar-08" as const;

type IconComponent = ComponentType<{ className?: string }>;

export type SidebarData = {
  /**
   * Teams shown in the team switcher. Names are demo content kept here so
   * forks can swap them without touching translations.
   */
  teams: { name: string; logo: ElementType; plan: string }[];
  navMain: {
    titleKey: string;
    url: string;
    icon?: IconComponent;
    isActive?: boolean;
    badge?: string;
  }[];
  navSecondary: {
    titleKey: string;
    url: string;
    icon?: IconComponent;
  }[];
  /**
   * Demo favorites — names are the user's own content in production, kept as
   * raw strings here so the sample renders cleanly without per-locale entries.
   */
  favorites: { name: string; url: string; emoji: string }[];
  workspaces: {
    name: string;
    emoji: string;
    pages: { name: string; url: string; emoji: string }[];
  }[];
};

export const sidebar08Data: SidebarData = {
  teams: [
    { name: "Acme Inc", logo: Command, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  navMain: [
    { titleKey: "navMain.search", url: "#", icon: Search },
    { titleKey: "navMain.askAi", url: "#", icon: Sparkles },
    { titleKey: "navMain.home", url: "#", icon: Home, isActive: true },
    { titleKey: "navMain.inbox", url: "#", icon: Inbox, badge: "10" },
  ],
  navSecondary: [
    { titleKey: "navSecondary.calendar", url: "#", icon: Calendar },
    { titleKey: "navSecondary.settings", url: "#", icon: Settings2 },
    { titleKey: "navSecondary.templates", url: "#", icon: Blocks },
    { titleKey: "navSecondary.trash", url: "#", icon: Trash2 },
    { titleKey: "navSecondary.help", url: "#", icon: MessageCircleQuestion },
  ],
  favorites: [
    { name: "Project Management & Task Tracking", url: "#", emoji: "📊" },
    { name: "Family Recipe Collection & Meal Planning", url: "#", emoji: "🍳" },
    { name: "Fitness Tracker & Workout Routines", url: "#", emoji: "💪" },
    { name: "Book Notes & Reading List", url: "#", emoji: "📚" },
    { name: "Sustainable Gardening Tips & Plant Care", url: "#", emoji: "🌱" },
    { name: "Language Learning Progress & Resources", url: "#", emoji: "🗣️" },
    { name: "Home Renovation Ideas & Budget Tracker", url: "#", emoji: "🏠" },
    { name: "Personal Finance & Investment Portfolio", url: "#", emoji: "💰" },
    { name: "Movie & TV Show Watchlist with Reviews", url: "#", emoji: "🎬" },
    { name: "Daily Habit Tracker & Goal Setting", url: "#", emoji: "✅" },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        { name: "Daily Journal & Reflection", url: "#", emoji: "📔" },
        { name: "Health & Wellness Tracker", url: "#", emoji: "🍏" },
        { name: "Personal Growth & Learning Goals", url: "#", emoji: "🌟" },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        { name: "Career Objectives & Milestones", url: "#", emoji: "🎯" },
        { name: "Skill Acquisition & Training Log", url: "#", emoji: "🧠" },
        { name: "Networking Contacts & Events", url: "#", emoji: "🤝" },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        { name: "Writing Ideas & Story Outlines", url: "#", emoji: "✍️" },
        { name: "Art & Design Portfolio", url: "#", emoji: "🖼️" },
        { name: "Music Composition & Practice Log", url: "#", emoji: "🎵" },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        { name: "Household Budget & Expense Tracking", url: "#", emoji: "💰" },
        { name: "Home Maintenance Schedule & Tasks", url: "#", emoji: "🔧" },
        { name: "Family Calendar & Event Planning", url: "#", emoji: "📅" },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        { name: "Trip Planning & Itineraries", url: "#", emoji: "🗺️" },
        { name: "Travel Bucket List & Inspiration", url: "#", emoji: "🌎" },
        { name: "Travel Journal & Photo Gallery", url: "#", emoji: "📸" },
      ],
    },
  ],
};
