import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Home,
  MessageCircle,
  User,
  Briefcase,
  FileText,
  Sparkles,
} from "lucide-react";
import { FloatingNav } from "./floating-navbar";

const meta: Meta<typeof FloatingNav> = {
  title: "UI Effects/FloatingNavbar",
  component: FloatingNav,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FloatingNav>;

const iconClass = "h-4 w-4 text-foreground";

const NAV_ITEMS = [
  {
    name: "Home",
    link: "#home",
    icon: <Home className={iconClass} aria-hidden />,
  },
  {
    name: "About",
    link: "#about",
    icon: <User className={iconClass} aria-hidden />,
  },
  {
    name: "Contact",
    link: "#contact",
    icon: <MessageCircle className={iconClass} aria-hidden />,
  },
];

/**
 * Static replica of the navbar markup. The real component starts hidden and
 * only animates in on scroll-up — which is unreliable inside Storybook's
 * iframe. Stories use this so the visual is always present; see `Live` below
 * to exercise the actual scroll-driven animation.
 */
const StaticNav = ({
  items,
  className,
}: {
  items: typeof NAV_ITEMS;
  className?: string;
}) => (
  <div className="pointer-events-none fixed inset-x-0 top-10 z-50 flex justify-center">
    <div
      className={`border-border bg-background/80 pointer-events-auto flex items-center gap-2 rounded-full border px-2 py-1.5 shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <div className="flex items-center gap-1">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.link}
            className="text-foreground hover:bg-muted relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            <span className="block sm:hidden">{item.icon}</span>
            <span className="hidden sm:block">{item.name}</span>
          </a>
        ))}
      </div>
      <div className="bg-border h-5 w-px" />
      <button className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium">
        Login
      </button>
    </div>
  </div>
);

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative h-[200vh] w-full">
    <div className="text-foreground mx-auto max-w-2xl px-6 pt-40">
      <h2 className="text-2xl font-semibold">Floating navbar</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Pinned at <code>top-10</code>, inside a frosted pill. In production
        the component animates in only when the user scrolls up; the stories
        below render the equivalent static markup so it&apos;s always visible.
      </p>
    </div>
    {children}
  </div>
);

/** Default — three nav items + the built-in Login CTA, statically pinned. */
export const Default: Story = {
  render: () => (
    <Page>
      <StaticNav items={NAV_ITEMS} />
    </Page>
  ),
};

/** Many items — six links exercise the horizontal layout. */
export const ManyItems: Story = {
  render: () => (
    <Page>
      <StaticNav
        items={[
          ...NAV_ITEMS,
          {
            name: "Work",
            link: "#work",
            icon: <Briefcase className={iconClass} aria-hidden />,
          },
          {
            name: "Blog",
            link: "#blog",
            icon: <FileText className={iconClass} aria-hidden />,
          },
          {
            name: "Pricing",
            link: "#pricing",
            icon: <Sparkles className={iconClass} aria-hidden />,
          },
        ]}
      />
    </Page>
  ),
};

/** Tinted — pass a `className` to override the navbar surface colour. */
export const Tinted: Story = {
  render: () => (
    <Page>
      <StaticNav items={NAV_ITEMS} className="!border-primary/30 !bg-primary/10" />
    </Page>
  ),
};

/**
 * Live — mounts the real `FloatingNav`. The component starts hidden; scroll
 * down past 5% of the page, then scroll back up to trigger the slide-in
 * animation. This may not always fire inside Storybook&apos;s iframe — use
 * the static stories above for reliable visual review.
 */
export const Live: Story = {
  render: () => (
    <div className="bg-background relative h-[300vh] w-full">
      <div className="text-foreground mx-auto max-w-2xl px-6 pt-40">
        <h2 className="text-2xl font-semibold">Scroll down, then back up</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Real <code>FloatingNav</code> mounted below. Scroll all the way down
          first, then scroll up — the navbar slides in from the top.
        </p>
      </div>
      <div className="text-muted-foreground/60 absolute bottom-12 left-1/2 -translate-x-1/2 text-xs">
        ↑ scroll back up to reveal the navbar
      </div>
      <FloatingNav navItems={NAV_ITEMS} />
    </div>
  ),
};
