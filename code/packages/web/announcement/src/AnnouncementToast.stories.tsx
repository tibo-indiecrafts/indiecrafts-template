import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnnouncementToast } from "./AnnouncementToast";

/**
 * The announcement toast — a fixed top-right card that can carry an image and a
 * clickable link (unlike the sonner toasts, which never auto-dismiss a link). Content
 * is the `announcementToast` Sanity singleton in the app; these stories pass a resolved
 * `toast` directly. Dismiss is remembered per content `version` (cookie), so each story
 * uses a distinct one to stay independent.
 */
const meta = {
  title: "Web/Chrome/AnnouncementToast",
  component: AnnouncementToast,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    dismissLabel: "Dismiss",
    toast: {
      version: "toast-default",
      title: "The winter collection is live",
      body: "New drops every Friday through December.",
      imageUrl: "https://picsum.photos/seed/toast/112/112",
      imageAlt: "Winter collection preview",
      link: {
        href: "https://example.com",
        external: true,
        newTab: true,
        label: "Explore the collection",
      },
    },
  },
} satisfies Meta<typeof AnnouncementToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Title only — no image, body, or link. */
export const TitleOnly: Story = {
  args: {
    toast: {
      version: "toast-title",
      title: "Scheduled maintenance tonight, 22:00–23:00 UTC.",
    },
  },
};

/** Text + an internal link, no image (internal paths use the app's i18n `Link`). */
export const WithLink: Story = {
  args: {
    toast: {
      version: "toast-link",
      title: "We shipped a faster checkout",
      body: "Fewer steps, same cart.",
      link: {
        href: "/changelog",
        external: false,
        newTab: false,
        label: "See what changed",
      },
    },
  },
};
