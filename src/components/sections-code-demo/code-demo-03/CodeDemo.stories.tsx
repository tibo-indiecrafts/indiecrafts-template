import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo03Section } from "./index";
import { codeDemo03Sample } from "./config";

const meta: Meta<typeof CodeDemo03Section> = {
  title: "Sections/CodeDemo/CodeDemo03",
  component: CodeDemo03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo03Section>;

export const Default: Story = {
  args: {
    ...codeDemo03Sample,
    id: "story-code-demo-03",
  } as React.ComponentProps<typeof CodeDemo03Section>,
};
