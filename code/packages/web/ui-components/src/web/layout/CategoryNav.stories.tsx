import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryNav } from "./CategoryNav";
import docs from "./CategoryNav.md?raw";

const meta = {
  title: "UI Components/CategoryNav",
  component: CategoryNav,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    label: "Blog categories",
    allLabel: "All",
    items: [
      {
        _key: "eng",
        title: "Engineering",
        href: "/blog/category/engineering",
        children: [
          { _key: "fe", title: "Frontend", href: "/blog/category/frontend" },
          { _key: "be", title: "Backend", href: "/blog/category/backend" },
        ],
      },
      {
        _key: "prod",
        title: "Product",
        href: "/blog/category/product",
        children: [
          { _key: "dsn", title: "Design", href: "/blog/category/design" },
          { _key: "gr", title: "Growth", href: "/blog/category/growth" },
        ],
      },
      { _key: "story", title: "Stories", href: "/blog/category/stories" },
    ],
  },
  argTypes: { items: { table: { disable: true } } },
} satisfies Meta<typeof CategoryNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FlatNoDropdowns: Story = {
  args: {
    items: [
      { _key: "a", title: "Engineering", href: "/blog/category/engineering" },
      { _key: "b", title: "Product", href: "/blog/category/product" },
      { _key: "c", title: "Stories", href: "/blog/category/stories" },
    ],
  },
};
