import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui-primitives/button";
import { CoolMode } from "./cool-mode";

const meta: Meta<typeof CoolMode> = {
  title: "UI Effects/Particles & Effects/CoolMode",
  component: CoolMode,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Click any wrapped element to spawn a particle burst. Particles physics use horizontal/upward speeds and gravity; tune via the `options` prop.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CoolMode>;

/** Default — wraps a button; click to fire particles. */
export const Default: Story = {
  render: () => (
    <CoolMode>
      <Button size="lg">Click me!</Button>
    </CoolMode>
  ),
};

/**
 * Custom particle — `options.particle` accepts an image URL used as the
 * spawned particle (here, a confetti SVG).
 */
export const CustomParticle: Story = {
  render: () => (
    <CoolMode
      options={{
        particle: "https://magicui.design/confetti.png",
      }}
    >
      <Button size="lg" variant="outline">
        Custom particle
      </Button>
    </CoolMode>
  ),
};

/** Heavy burst — 15 particles per click instead of the default. */
export const HeavyBurst: Story = {
  render: () => (
    <CoolMode options={{ particleCount: 15, speedHorz: 8, speedUp: 14 }}>
      <Button size="lg" variant="secondary">
        Heavy burst
      </Button>
    </CoolMode>
  ),
};

/** Wraps a regular link — works on any element, not just buttons. */
export const OnLink: Story = {
  render: () => (
    <CoolMode>
      <a
        href="#cool"
        className="text-primary text-lg font-medium underline-offset-4 hover:underline"
      >
        Click this link
      </a>
    </CoolMode>
  ),
};
