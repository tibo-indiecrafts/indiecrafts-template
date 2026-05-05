import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo2Section } from "./index";
import { codeDemo2Sample } from "./config";

const meta: Meta<typeof CodeDemo2Section> = {
  title: "Sections/CodeDemo/CodeDemo2",
  component: CodeDemo2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo2Section>;

export const Default: Story = {
  args: {
    ...codeDemo2Sample,
    id: "story-code-demo-2",
  } as React.ComponentProps<typeof CodeDemo2Section>,
};
