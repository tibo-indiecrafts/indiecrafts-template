import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "./progress";
import docs from "./progress.md?raw";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Progress value={60} className="w-72" />,
};
