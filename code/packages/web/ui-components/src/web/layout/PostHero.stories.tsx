import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostHero } from "./PostHero";
import docs from "./PostHero.md?raw";

const meta = {
  title: "UI Components/PostHero",
  component: PostHero,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    href: "/blog/config-first-vs-convention-first",
    title: "Why config-first beats convention-first for client work",
    excerpt:
      "A modular, config-driven codebase ships faster than a fresh fork for every client — here's the architecture that makes it work.",
    image: "https://picsum.photos/seed/posthero/1600/900",
    alt: "Cover",
    category: { title: "Engineering", href: "/blog/category/engineering" },
    author: "Alex Rivera",
    date: "August 12, 2026",
    playLabel: "Play video",
  },
} satisfies Meta<typeof PostHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVideo: Story = {
  args: { video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const NoImage: Story = {
  args: { image: undefined, video: undefined },
};
