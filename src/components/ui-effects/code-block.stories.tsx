import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "./code-block";

const meta: Meta<typeof CodeBlock> = {
  title: "UI Effects/CodeBlock",
  component: CodeBlock,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeBlock>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[640px] max-w-full">{children}</div>
);

const tsxSample = `import { Button } from "@/components/ui-primitives/button";

export function CTA() {
  return (
    <div className="flex gap-3">
      <Button variant="outline">Maybe later</Button>
      <Button>Get started</Button>
    </div>
  );
}`;

const bashSample = `# scaffold a new page in 30 seconds
pnpm new:page contact
pnpm verify`;

const jsonSample = `{
  "name": "indiecrafts-template",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "verify": "pnpm tsc && pnpm lint && pnpm format:check"
  }
}`;

const longTsx = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  const reset = () => setCount(0);
  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);

  return (
    <div className="flex items-center gap-2">
      <button onClick={dec}>-</button>
      <span className="tabular-nums">{count}</span>
      <button onClick={inc}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}`;

/** Default — TSX with filename and copy button. */
export const Default: Story = {
  render: () => (
    <Frame>
      <CodeBlock language="tsx" filename="cta.tsx" code={tsxSample} />
    </Frame>
  ),
};

/** Bash — exercises a different language highlighter. */
export const Bash: Story = {
  render: () => (
    <Frame>
      <CodeBlock language="bash" filename="quickstart.sh" code={bashSample} />
    </Frame>
  ),
};

/** JSON — language switch + dotted highlighting. */
export const Json: Story = {
  render: () => (
    <Frame>
      <CodeBlock language="json" filename="package.json" code={jsonSample} />
    </Frame>
  ),
};

/** Highlighted lines — `highlightLines` underlines specific rows. */
export const Highlighted: Story = {
  render: () => (
    <Frame>
      <CodeBlock
        language="tsx"
        filename="counter.tsx"
        code={longTsx}
        highlightLines={[5, 6, 7]}
      />
    </Frame>
  ),
};

/** Tabs — multiple snippets share one filename header. */
export const Tabs: Story = {
  render: () => (
    <Frame>
      <CodeBlock
        language="tsx"
        filename="auth"
        tabs={[
          { name: "client.tsx", code: tsxSample, language: "tsx" },
          { name: "server.ts", code: jsonSample, language: "json" },
          { name: "setup.sh", code: bashSample, language: "bash" },
        ]}
      />
    </Frame>
  ),
};
