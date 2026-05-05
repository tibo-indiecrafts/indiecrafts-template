import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo3Section } from "./index";
import { codeDemo3Sample } from "./config";

const meta: Meta<typeof CodeDemo3Section> = {
  title: "Sections/CodeDemo/CodeDemo3",
  component: CodeDemo3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo3Section>;

export const Default: Story = {
  args: {
    ...codeDemo3Sample,
    id: "story-code-demo-3",
  } as React.ComponentProps<typeof CodeDemo3Section>,
};
