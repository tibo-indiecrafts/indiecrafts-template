import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo04Section } from "./index";
import { codeDemo04Sample } from "./config";

const meta: Meta<typeof CodeDemo04Section> = {
  title: "Sections/CodeDemo/CodeDemo04",
  component: CodeDemo04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo04Section>;

export const Default: Story = {
  args: {
    ...codeDemo04Sample,
    id: "story-code-demo-04",
  } as React.ComponentProps<typeof CodeDemo04Section>,
};
