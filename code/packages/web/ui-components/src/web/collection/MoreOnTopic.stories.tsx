import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoreOnTopic } from "./MoreOnTopic";
import docs from "./MoreOnTopic.md?raw";

const meta = {
  title: "Web/UI Components/MoreOnTopic",
  component: MoreOnTopic,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    title: "More on Engineering",
    items: [
      {
        _key: "a",
        title: "Why config-first beats convention-first for client work",
        href: "/blog/config-first-vs-convention-first",
        meta: "6 min read",
      },
      {
        _key: "b",
        title: "The minimum-viable GDPR cookie banner",
        href: "/blog/minimum-viable-cookie-banner",
        meta: "4 min read",
      },
      {
        _key: "c",
        title: "Zero-backend contact forms with Netlify",
        href: "/blog/netlify-forms-zero-backend",
        meta: "5 min read",
      },
    ],
    footer: {
      label: "All Engineering posts",
      href: "/blog/category/engineering",
    },
  },
  argTypes: {
    items: { table: { disable: true } },
  },
} satisfies Meta<typeof MoreOnTopic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutFooter: Story = { args: { footer: undefined } };

export const TitlesOnly: Story = {
  args: {
    footer: undefined,
    items: [
      {
        _key: "a",
        title: "Fast prototyping with Next.js: zero to MVP in a weekend",
        href: "/blog/fast-prototyping-with-nextjs",
      },
      {
        _key: "b",
        title: "Shipping a client site in a weekend",
        href: "/blog/shipping-in-a-weekend",
      },
    ],
  },
};
