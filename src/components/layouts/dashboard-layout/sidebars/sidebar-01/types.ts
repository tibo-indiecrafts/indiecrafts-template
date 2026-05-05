import type { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

export interface NavItem {
  id: string;
  icon: IconComponent;
  url?: string;
  isActive?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface FavoriteItem {
  id: string;
  href?: string;
  color: string;
}

export interface TeamItem {
  id: string;
  icon: IconComponent;
}

export interface TopicItem {
  id: string;
  icon: IconComponent;
}

export interface SidebarData {
  user: User;
  navMain: NavItem[];
  navCollapsible: {
    favorites: FavoriteItem[];
    teams: TeamItem[];
    topics: TopicItem[];
  };
}
