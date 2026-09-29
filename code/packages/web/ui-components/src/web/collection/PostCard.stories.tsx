import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostCard } from "./PostCard";

/**
 * A compact post card — image, category chip, title, author · date — shared by
 * `FeaturedPosts` and `SpotlightRow` so both render identical cards. Whole-card click
 * via a stretched `<a>` over the title (like `PostHero`/`FeaturedPosts`).
 */
const meta = {
  title: "UI Components/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    post: {
      _key: "p1",
      href: "/blog/design-tokens-that-survive-a-rebrand",
      title: "Design tokens that survive a rebrand",
      image: "https://picsum.photos/seed/postcard/1200/900",
      category: "Design",
      author: "Priya Nair",
      date: "August 12, 2026",
    },
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No cover image — the card keeps its 4:3 aspect box with a muted placeholder. */
export const NoImage: Story = {
  args: {
    post: {
      _key: "p2",
      href: "/blog/a-quieter-card",
      title: "A quieter card without a cover image",
      category: "Process",
      author: "Sam Okafor",
      date: "July 22, 2026",
    },
  },
};

/** Title + link only — no category, author, or date. */
export const TitleOnly: Story = {
  args: {
    post: {
      _key: "p3",
      href: "/blog/minimal-metadata",
      title: "Minimal metadata",
    },
  },
};
