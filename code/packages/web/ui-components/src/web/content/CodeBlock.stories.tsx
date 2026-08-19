import { Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "./CodeBlock";
import { Async } from "../_async-story";
import docs from "./CodeBlock.md?raw";

// Async server component (Shiki). Storybook's client runtime can't render an
// async component directly, so we unwrap it via `Async` + `Suspense`. Colours
// swap with the theme toolbar (light/dark theme pair).
const meta = {
  title: "UI Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  render: (args) => (
    <Suspense fallback={null}>
      <Async
        produce={() => CodeBlock(args)}
        deps={[JSON.stringify(args.value)]}
      />
    </Suspense>
  ),
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {
  args: {
    value: {
      language: "ts",
      filename: "config/features.ts",
      code: `export const features = {\n  blog: true,\n  blogSearch: true,\n} as const;`,
    },
  },
};

export const Bash: Story = {
  args: { value: { language: "bash", code: "pnpm storybook" } },
};

export const UnknownLanguageFallback: Story = {
  args: {
    value: {
      language: "not-a-language",
      code: "plain <pre> fallback, no highlighting",
    },
  },
};
