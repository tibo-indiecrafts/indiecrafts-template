import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo01Section } from "./index";
import { codeDemo01Sample } from "./config";

const meta: Meta<typeof CodeDemo01Section> = {
  title: "Sections/CodeDemo/CodeDemo01",
  component: CodeDemo01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo01Section>;

export const Default: Story = {
  args: {
    ...codeDemo01Sample,
    id: "story-code-demo-01",
  } as React.ComponentProps<typeof CodeDemo01Section>,
};
