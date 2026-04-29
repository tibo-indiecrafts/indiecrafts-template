import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "UI Primitives/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AspectRatio>;

const Image = ({ className }: { className?: string }) => (
  <div
    className={`bg-muted flex h-full w-full items-center justify-center rounded-md ${className ?? ""}`}
  >
    <span className="text-muted-foreground text-sm">Image</span>
  </div>
);

/** 16:9 — most common video / hero card ratio. */
export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9}>
        <Image />
      </AspectRatio>
    </div>
  ),
};

/** Common ratios laid out for comparison. */
export const Ratios: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-3 gap-4">
      {[
        { ratio: 16 / 9, label: "16:9" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 1, label: "1:1" },
        { ratio: 3 / 4, label: "3:4" },
        { ratio: 9 / 16, label: "9:16" },
        { ratio: 21 / 9, label: "21:9" },
      ].map((r) => (
        <div key={r.label} className="grid gap-1.5">
          <p className="text-muted-foreground text-xs">{r.label}</p>
          <AspectRatio ratio={r.ratio}>
            <Image />
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};
