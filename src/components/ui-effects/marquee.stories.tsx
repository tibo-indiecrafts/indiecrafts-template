import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Marquee } from "./marquee";

const meta: Meta<typeof Marquee> = {
  title: "UI Effects/Marquees & Scroll/Marquee",
  component: Marquee,
  parameters: { layout: "fullscreen" },
  argTypes: {
    reverse: { control: "boolean" },
    pauseOnHover: { control: "boolean" },
    vertical: { control: "boolean" },
    repeat: { control: { type: "range", min: 1, max: 8, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof Marquee>;

const LOGOS = [
  "TypeScript",
  "Next.js",
  "Tailwind",
  "shadcn/ui",
  "Magic UI",
  "Aceternity",
  "Radix",
  "Vercel",
  "Vite",
  "Vitest",
];

const Tile = ({ label }: { label: string }) => (
  <div className="border-border bg-card text-foreground inline-flex h-12 items-center justify-center rounded-md border px-6 text-sm font-medium whitespace-nowrap">
    {label}
  </div>
);

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-6">
    {children}
  </div>
);

/**
 * Default — left-scrolling marquee at 40s per loop. The component repeats its
 * children `repeat` times to fill the container; lower the count if your tile
 * count is already large.
 */
export const Default: Story = {
  args: { repeat: 4 },
  render: (args) => (
    <Stage>
      <Marquee {...args} className="w-[640px]">
        {LOGOS.map((l) => (
          <Tile key={l} label={l} />
        ))}
      </Marquee>
    </Stage>
  ),
};

/** Reverse — `reverse` flips the scroll direction. */
export const Reverse: Story = {
  args: { reverse: true, repeat: 4 },
  render: (args) => (
    <Stage>
      <Marquee {...args} className="w-[640px]">
        {LOGOS.map((l) => (
          <Tile key={l} label={l} />
        ))}
      </Marquee>
    </Stage>
  ),
};

/** Pause on hover — `pauseOnHover` stops the marquee while the cursor is over it. */
export const PauseOnHover: Story = {
  args: { pauseOnHover: true, repeat: 4 },
  render: (args) => (
    <Stage>
      <Marquee {...args} className="w-[640px]">
        {LOGOS.map((l) => (
          <Tile key={l} label={l} />
        ))}
      </Marquee>
    </Stage>
  ),
};

/**
 * Vertical — `vertical` switches axis. Animation speed comes from the
 * `--duration` CSS var on the marquee container — override via className.
 */
export const Vertical: Story = {
  args: { vertical: true, repeat: 4 },
  render: (args) => (
    <Stage>
      <Marquee {...args} className="h-[260px] w-fit">
        {LOGOS.map((l) => (
          <Tile key={l} label={l} />
        ))}
      </Marquee>
    </Stage>
  ),
};

/** Two-row showcase — paired top/bottom rows scrolling in opposite directions. */
export const TwoRows: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background flex min-h-[260px] w-full flex-col items-center justify-center gap-3 p-6">
      <Marquee className="w-full">
        {LOGOS.map((l) => (
          <Tile key={`a-${l}`} label={l} />
        ))}
      </Marquee>
      <Marquee reverse className="w-full">
        {LOGOS.map((l) => (
          <Tile key={`b-${l}`} label={l} />
        ))}
      </Marquee>
    </div>
  ),
};
