import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Home,
  Search,
  Settings,
  Mail,
  User,
  BellRing,
  Compass,
  Heart,
  ImageIcon,
  Music,
  Calendar,
} from "lucide-react";
import { FloatingDock } from "./floating-dock";

const meta: Meta<typeof FloatingDock> = {
  title: "UI Effects/Nav/FloatingDock",
  component: FloatingDock,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FloatingDock>;

const iconClass = "h-full w-full text-foreground";

const ITEMS = [
  {
    title: "Home",
    icon: <Home className={iconClass} aria-hidden />,
    href: "#home",
  },
  {
    title: "Search",
    icon: <Search className={iconClass} aria-hidden />,
    href: "#search",
  },
  {
    title: "Notifications",
    icon: <BellRing className={iconClass} aria-hidden />,
    href: "#notify",
  },
  {
    title: "Mail",
    icon: <Mail className={iconClass} aria-hidden />,
    href: "#mail",
  },
  {
    title: "Profile",
    icon: <User className={iconClass} aria-hidden />,
    href: "#profile",
  },
  {
    title: "Settings",
    icon: <Settings className={iconClass} aria-hidden />,
    href: "#settings",
  },
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex min-h-[400px] w-full flex-col items-center justify-end pb-8">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <p className="text-muted-foreground absolute top-12 max-w-md text-center text-sm">
        Hover the dock to magnify icons. Resize the canvas under 768px to see the mobile
        collapse variant.
      </p>
      <FloatingDock items={ITEMS} />
    </Stage>
  ),
};

export const FewItems: Story = {
  render: () => (
    <Stage>
      <FloatingDock
        items={[
          {
            title: "Home",
            icon: <Home className={iconClass} aria-hidden />,
            href: "#home",
          },
          {
            title: "Search",
            icon: <Search className={iconClass} aria-hidden />,
            href: "#search",
          },
          {
            title: "Profile",
            icon: <User className={iconClass} aria-hidden />,
            href: "#profile",
          },
        ]}
      />
    </Stage>
  ),
};

export const ManyItems: Story = {
  render: () => (
    <Stage>
      <FloatingDock
        items={[
          ...ITEMS,
          {
            title: "Discover",
            icon: <Compass className={iconClass} aria-hidden />,
            href: "#discover",
          },
          {
            title: "Favourites",
            icon: <Heart className={iconClass} aria-hidden />,
            href: "#favs",
          },
          {
            title: "Photos",
            icon: <ImageIcon className={iconClass} aria-hidden />,
            href: "#photos",
          },
          {
            title: "Music",
            icon: <Music className={iconClass} aria-hidden />,
            href: "#music",
          },
          {
            title: "Calendar",
            icon: <Calendar className={iconClass} aria-hidden />,
            href: "#calendar",
          },
        ]}
      />
    </Stage>
  ),
};

export const ThemedSurface: Story = {
  render: () => (
    <Stage>
      <FloatingDock
        items={ITEMS}
        desktopClassName="bg-card border border-border shadow-lg"
      />
    </Stage>
  ),
};

export const Pinned: Story = {
  render: () => (
    <div className="bg-background relative min-h-svh w-full overflow-hidden">
      <div className="px-6 py-12">
        <h2 className="text-foreground text-2xl font-semibold">Scroll content</h2>
        <p className="text-muted-foreground mt-2 max-w-prose text-sm">
          The dock stays pinned to the bottom of the viewport. On mobile the toggle pins
          to the bottom-right corner via <code className="text-xs">mobileClassName</code>.
        </p>
      </div>
      <FloatingDock
        items={ITEMS}
        desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-6 right-6 z-50"
      />
    </div>
  ),
};
