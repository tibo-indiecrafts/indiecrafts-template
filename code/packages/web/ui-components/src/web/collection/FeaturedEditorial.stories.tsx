import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedEditorial } from "./FeaturedEditorial";
import docs from "./FeaturedEditorial.md?raw";

const post = (n: number, title: string) => ({
  _key: `p${n}`,
  href: `/blog/post-${n}`,
  title,
  image: `https://picsum.photos/seed/editorial${n}/1200/800`,
  category: "Engineering",
  author: "Alex Rivera",
  date: "August 19, 2026",
});

const posts = [
  {
    ...post(1, "The frontpage that composes itself"),
    excerpt: "One schema, three layouts, zero code changes.",
  },
  post(2, "Why config-first beats convention-first for client work"),
  post(3, "Shipping faster with modular monorepos"),
  post(4, "Design tokens that survive a rebrand"),
];

const meta = {
  title: "UI Components/FeaturedEditorial",
  component: FeaturedEditorial,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  decorators: [
    (Story) => (
      <div className="@container">
        <Story />
      </div>
    ),
  ],
  args: { posts, playLabel: "Play video" },
  argTypes: { posts: { table: { disable: true } } },
} satisfies Meta<typeof FeaturedEditorial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LeadOnly: Story = { args: { posts: posts.slice(0, 1) } };
