import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedPosts } from "./FeaturedPosts";
import docs from "./FeaturedPosts.md?raw";

const lead = {
  _key: "lead",
  href: "/blog/the-frontpage-that-composes-itself",
  title: "The frontpage that composes itself",
  image: "https://picsum.photos/seed/featuredlead/1600/1200",
  category: "Engineering",
  author: "Alex Rivera",
  date: "August 19, 2026",
};

const items = [
  {
    _key: "p1",
    href: "/blog/config-first-vs-convention-first",
    title: "Why config-first beats convention-first for client work",
    image: "https://picsum.photos/seed/featured1/1200/900",
    category: "Engineering",
    author: "Alex Rivera",
    date: "August 12, 2026",
  },
  {
    _key: "p2",
    href: "/blog/shipping-faster-with-modular-monorepos",
    title: "Shipping faster with modular monorepos",
    image: "https://picsum.photos/seed/featured2/1200/900",
    category: "Process",
    author: "Jamie Chen",
    date: "August 5, 2026",
  },
  {
    _key: "p3",
    href: "/blog/design-tokens-that-survive-a-rebrand",
    title: "Design tokens that survive a rebrand",
    image: "https://picsum.photos/seed/featured3/1200/900",
    category: "Design",
    author: "Priya Nair",
    date: "July 29, 2026",
  },
  {
    _key: "p4",
    href: "/blog/the-case-for-server-first-components",
    title: "The case for server-first components",
    image: "https://picsum.photos/seed/featured4/1200/900",
    category: "Engineering",
    author: "Sam Okafor",
    date: "July 22, 2026",
  },
];

const meta = {
  title: "Web/UI Components/FeaturedPosts",
  component: FeaturedPosts,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    heading: "Featured",
    lead,
    items,
  },
  argTypes: {
    lead: { table: { disable: true } },
    items: { table: { disable: true } },
  },
} satisfies Meta<typeof FeaturedPosts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoLead: Story = {
  args: { lead: undefined },
};

export const TwoItems: Story = {
  args: { items: items.slice(0, 2) },
};
