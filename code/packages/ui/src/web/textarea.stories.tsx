import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";
import docs from "./textarea.md?raw";
import { Label } from "./label";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: { placeholder: "Write your message…" },
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" {...args} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
