import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeBlock from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  title: "UI Molecules/Code/CodeBlock",
  component: CodeBlock,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Javascript: Story = {
  args: {
    lang: "javascript",
    code: "const greet = (name) => `Hello, ${name}!`;\n\nconsole.log(greet('world'));",
    maxHeight: 200,
  },
};

export const Python: Story = {
  args: {
    lang: "python",
    code: "def greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('world'))",
    maxHeight: 200,
  },
};
