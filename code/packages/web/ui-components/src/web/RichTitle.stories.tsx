import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RichTitle } from "./RichTitle";
import docs from "./RichTitle.md?raw";

// Shared title primitive: renders a heading from a string and colours any
// `[[word]]` span with the brand accent.
const meta = {
  title: "Web/UI Components/RichTitle",
  component: RichTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: docs } },
  },
  args: {
    as: "h2",
    className: "text-4xl font-semibold text-balance",
    children: "Built to [[cover]] your needs",
  },
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "p", "span"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof RichTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoHighlight: Story = {
  args: { children: "A plain title with no marker" },
};

export const MultipleHighlights: Story = {
  args: { children: "[[Design]] and [[ship]] faster" },
};
