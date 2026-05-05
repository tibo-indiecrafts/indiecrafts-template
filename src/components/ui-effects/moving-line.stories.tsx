import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MovingLine, { Content } from "./moving-line";

const meta: Meta<typeof MovingLine> = {
  title: "UI Effects/Marquees & Scroll/MovingLine",
  component: MovingLine,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MovingLine>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full bg-slate-950 p-10">{children}</div>
);

/**
 * Default — vertical SVG path that draws as the user scrolls toward the
 * section. The component owns its own scroll target ref and a long
 * placeholder body so the line has room to animate.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <MovingLine />
    </Stage>
  ),
};

/**
 * Just content — render a single `Content` block without the line, useful
 * for editing layout copy in isolation.
 */
export const ContentOnly: Story = {
  render: () => (
    <Stage>
      <div className="mx-auto max-w-2xl">
        <Content />
      </div>
    </Stage>
  ),
};
