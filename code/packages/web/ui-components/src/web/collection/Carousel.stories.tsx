import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carousel } from "./Carousel";
import docs from "./Carousel.md?raw";

const items = [
  {
    _key: "c1",
    href: "/blog/config-first-vs-convention-first",
    title: "Why config-first beats convention-first for client work",
    image: "https://picsum.photos/seed/carousel1/1200/900",
    category: "Engineering",
    author: "Alex Rivera",
    date: "August 12, 2026",
  },
  {
    _key: "c2",
    href: "/blog/shipping-faster-with-modular-monorepos",
    title: "Shipping faster with modular monorepos",
    image: "https://picsum.photos/seed/carousel2/1200/900",
    category: "Process",
    author: "Jamie Chen",
    date: "August 5, 2026",
  },
  {
    _key: "c3",
    href: "/blog/design-tokens-that-survive-a-rebrand",
    title: "Design tokens that survive a rebrand",
    image: "https://picsum.photos/seed/carousel3/1200/900",
    category: "Design",
    author: "Priya Nair",
    date: "July 29, 2026",
  },
  {
    _key: "c4",
    href: "/blog/the-case-for-server-first-components",
    title: "The case for server-first components",
    image: "https://picsum.photos/seed/carousel4/1200/900",
    category: "Engineering",
    author: "Sam Okafor",
    date: "July 22, 2026",
  },
  {
    _key: "c5",
    href: "/blog/writing-groq-that-scales",
    title: "Writing GROQ queries that scale with your content",
    image: "https://picsum.photos/seed/carousel5/1200/900",
    category: "Engineering",
    author: "Alex Rivera",
    date: "July 15, 2026",
  },
];

const meta = {
  title: "UI Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    heading: "From the blog",
    intro: "A curated selection, picked by the editors.",
    items,
    labels: { prev: "Previous", next: "Next", slide: "slide" },
  },
  argTypes: {
    items: { table: { disable: true } },
    labels: { table: { disable: true } },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoSlides: Story = {
  args: { items: items.slice(0, 2) },
};
