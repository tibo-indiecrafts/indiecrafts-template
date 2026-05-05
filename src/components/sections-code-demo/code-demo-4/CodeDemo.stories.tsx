import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo4Section } from "./index";
import { codeDemo4Sample } from "./config";

const meta: Meta<typeof CodeDemo4Section> = {
  title: "Sections/CodeDemo/CodeDemo4",
  component: CodeDemo4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo4Section>;

export const Default: Story = {
  args: {
    ...codeDemo4Sample,
    id: "story-code-demo-4",
  } as React.ComponentProps<typeof CodeDemo4Section>,
};
