import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import docs from "./label.md?raw";
import { Input } from "./input";

const meta = {
  title: "Web/UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: { children: "Email address" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithControl: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="Ada Lovelace" />
    </div>
  ),
};
