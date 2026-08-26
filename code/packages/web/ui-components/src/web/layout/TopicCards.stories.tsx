import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopicCards } from "./TopicCards";
import docs from "./TopicCards.md?raw";

const items = [
  {
    _key: "t1",
    href: "/blog/category/engineering",
    title: "Engineering",
    blurb: "Architecture, tooling, and the craft of shipping reliable software.",
    image: "https://picsum.photos/seed/topic1/1200/900",
  },
  {
    _key: "t2",
    href: "/blog/category/design",
    title: "Design",
    blurb: "Design systems, tokens, and the details that make an interface feel right.",
    image: "https://picsum.photos/seed/topic2/1200/900",
  },
  {
    _key: "t3",
    href: "/blog/tag/process",
    title: "Process",
    blurb: "How modular monorepos and config-first thinking speed up delivery.",
    image: "https://picsum.photos/seed/topic3/1200/900",
  },
];

const meta = {
  title: "UI Components/TopicCards",
  component: TopicCards,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: { items },
} satisfies Meta<typeof TopicCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Single: Story = {
  args: { items: items.slice(0, 1) },
};
