import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpotlightRow } from "./SpotlightRow";
import docs from "./SpotlightRow.md?raw";

const items = [
  {
    _key: "p1",
    href: "/blog/config-first-vs-convention-first",
    title: "Why config-first beats convention-first for client work",
    image: "https://picsum.photos/seed/spotlight1/1200/900",
    category: "Engineering",
    author: "Alex Rivera",
    date: "August 12, 2026",
  },
  {
    _key: "p2",
    href: "/blog/shipping-faster-with-modular-monorepos",
    title: "Shipping faster with modular monorepos",
    image: "https://picsum.photos/seed/spotlight2/1200/900",
    category: "Engineering",
    author: "Jamie Chen",
    date: "August 5, 2026",
  },
  {
    _key: "p3",
    href: "/blog/design-tokens-that-survive-a-rebrand",
    title: "Design tokens that survive a rebrand",
    image: "https://picsum.photos/seed/spotlight3/1200/900",
    category: "Engineering",
    author: "Priya Nair",
    date: "July 29, 2026",
  },
  {
    _key: "p4",
    href: "/blog/the-case-for-server-first-components",
    title: "The case for server-first components",
    image: "https://picsum.photos/seed/spotlight4/1200/900",
    category: "Engineering",
    author: "Sam Okafor",
    date: "July 22, 2026",
  },
];

const meta = {
  title: "UI Components/SpotlightRow",
  component: SpotlightRow,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    heading: "Engineering",
    subheading:
      "How we build indiecrafts.dev — architecture, tooling, and the decisions behind them.",
    items,
    viewAll: { label: "All Engineering", href: "/blog/category/engineering" },
  },
  argTypes: {
    items: { table: { disable: true } },
  },
} satisfies Meta<typeof SpotlightRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoViewAll: Story = {
  args: { viewAll: undefined },
};
