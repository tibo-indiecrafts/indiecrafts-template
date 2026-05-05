import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo1Section } from "./index";
import { codeDemo1Sample } from "./config";

const meta: Meta<typeof CodeDemo1Section> = {
  title: "Sections/CodeDemo/CodeDemo1",
  component: CodeDemo1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo1Section>;

export const Default: Story = {
  args: {
    ...codeDemo1Sample,
    id: "story-code-demo-1",
  } as React.ComponentProps<typeof CodeDemo1Section>,
};
