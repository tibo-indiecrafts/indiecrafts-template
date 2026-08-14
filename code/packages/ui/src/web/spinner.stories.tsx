import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "./spinner";
import docs from "./spinner.md?raw";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-muted-foreground">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
};
