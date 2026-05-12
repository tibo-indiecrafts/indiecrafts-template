import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeDemo02Section } from "./index";
import { codeDemo02Sample } from "./config";

const meta: Meta<typeof CodeDemo02Section> = {
  title: "Sections/CodeDemo/CodeDemo02",
  component: CodeDemo02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeDemo02Section>;

export const Default: Story = {
  args: {
    ...codeDemo02Sample,
    id: "story-code-demo-02",
  } as React.ComponentProps<typeof CodeDemo02Section>,
};
