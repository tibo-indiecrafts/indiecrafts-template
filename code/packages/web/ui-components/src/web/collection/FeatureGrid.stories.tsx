import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeatureGrid } from "./FeatureGrid";
import docs from "./FeatureGrid.md?raw";

const items = [
  {
    _key: "f1",
    icon: "zap" as const,
    title: "Fast",
    body: "Zero to MVP in a weekend.",
  },
  {
    _key: "f2",
    icon: "settings" as const,
    title: "Configurable",
    body: "Every client, one codebase.",
  },
  {
    _key: "f3",
    icon: "shield" as const,
    title: "Secure",
    body: "Server tokens never leak to the client.",
  },
];

const meta = {
  title: "UI Components/FeatureGrid",
  component: FeatureGrid,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.feature-grid",
    title: "Why us",
    intro: "The short version.",
    items,
  },
  argTypes: {
    items: { table: { disable: true } },
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoHeader: Story = { args: { title: undefined, intro: undefined } };
export const SingleItem: Story = { args: { items: items.slice(0, 1) } };
