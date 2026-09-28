import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnnouncementBar } from "./AnnouncementBar";
import docs from "./AnnouncementBar.md?raw";

/**
 * The announcement / discount strip. Content is the `announcementBar` Sanity
 * singleton in the app; these stories pass items directly. External links render as
 * plain anchors (internal paths use the app's i18n `Link`).
 */
const item = (message: string, extra: Record<string, unknown> = {}) => ({
  message,
  ...extra,
});

const meta = {
  title: "Web/Chrome/AnnouncementBar",
  component: AnnouncementBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docs } },
  },
  args: {
    version: "demo",
    dismissible: true,
    regionLabel: "Announcement",
    dismissLabel: "Dismiss",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    items: [
      item("30% off this weekend with code", {
        discountCode: "SAVE30",
        link: {
          href: "https://example.com",
          external: true,
          newTab: true,
          label: "Shop now",
        },
      }),
    ],
  },
} satisfies Meta<typeof AnnouncementBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};
export const Neutral: Story = { args: { variant: "neutral" } };
export const Contrast: Story = { args: { variant: "contrast" } };
export const NotDismissible: Story = { args: { dismissible: false } };

/** Multiple announcements rotate on a gentle interval. */
export const Multiple: Story = {
  args: {
    items: [
      item("Free shipping on orders over €50"),
      item("The winter collection is live", {
        link: {
          href: "https://example.com",
          external: true,
          newTab: true,
          label: "Explore",
        },
      }),
      item("Save 25% with code", { discountCode: "WINTER25" }),
    ],
  },
};
