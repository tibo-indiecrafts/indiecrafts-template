import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./moving-border";

const meta: Meta<typeof Button> = {
  title: "UI Effects/MovingBorder",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 1000, max: 8000, step: 250 } },
    borderRadius: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — pill-shaped button with a glowing dot that travels around the
 * border on a 3s loop. The dot is rendered inside an SVG path which the
 * component samples via `getPointAtLength` for smooth motion.
 */
export const Default: Story = {
  args: { duration: 3000, borderRadius: "1.75rem" },
  render: (args) => (
    <Stage>
      <Button {...args}>Get started</Button>
    </Stage>
  ),
};

/** Slow — `duration={6000}` halves the speed for a more deliberate vibe. */
export const Slow: Story = {
  args: { duration: 6000 },
  render: (args) => (
    <Stage>
      <Button {...args}>Slow loop</Button>
    </Stage>
  ),
};

/** Fast — `duration={1500}` keeps the dot moving briskly. */
export const Fast: Story = {
  args: { duration: 1500 },
  render: (args) => (
    <Stage>
      <Button {...args}>Fast loop</Button>
    </Stage>
  ),
};

/** Square — `borderRadius="0.5rem"` for a card-style outline. */
export const Square: Story = {
  args: { duration: 3000, borderRadius: "0.5rem" },
  render: (args) => (
    <Stage>
      <Button {...args}>Square corners</Button>
    </Stage>
  ),
};

/**
 * Brand glow — `borderClassName` overrides the radial gradient with stops
 * that reference the `--color-primary` token, so a rebrand updates the
 * trail colour automatically.
 */
export const BrandGlow: Story = {
  render: () => (
    <Stage>
      <Button
        duration={3000}
        borderClassName="bg-[radial-gradient(var(--color-primary)_40%,transparent_60%)]"
      >
        Brand trail
      </Button>
    </Stage>
  ),
};

/** As link — `as="a"` swaps the rendered tag from `<button>` to `<a>`. */
export const AsLink: Story = {
  render: () => (
    <Stage>
      <Button as="a" href="#hello" duration={3000}>
        Read the post
      </Button>
    </Stage>
  ),
};
