/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Lens } from "./lens";

const meta: Meta<typeof Lens> = {
  title: "UI Effects/Hover & Interactions/Lens",
  component: Lens,
  parameters: { layout: "centered" },
  argTypes: {
    zoomFactor: { control: { type: "range", min: 1, max: 4, step: 0.1 } },
    lensSize: { control: { type: "range", min: 80, max: 320, step: 10 } },
    isStatic: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Lens>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[480px] w-full items-center justify-center p-6">
    <div className="w-[480px]">{children}</div>
  </div>
);

const Photo = () => (
  <img
    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80"
    alt="Mountain reflection"
    className="block h-[320px] w-full rounded-lg object-cover"
  />
);

/**
 * Default — hover the photo to reveal a 170px circular lens that magnifies
 * the area under the cursor by 1.5×. Move the cursor to drag the lens.
 */
export const Default: Story = {
  args: { zoomFactor: 1.5, lensSize: 170 },
  render: (args) => (
    <Frame>
      <Lens {...args}>
        <Photo />
      </Lens>
    </Frame>
  ),
};

/** Stronger zoom — `zoomFactor={3}` for a microscope-level magnification. */
export const StrongZoom: Story = {
  args: { zoomFactor: 3, lensSize: 170 },
  render: (args) => (
    <Frame>
      <Lens {...args}>
        <Photo />
      </Lens>
    </Frame>
  ),
};

/** Larger lens — `lensSize={280}` covers a wider area. */
export const LargeLens: Story = {
  args: { zoomFactor: 2, lensSize: 280 },
  render: (args) => (
    <Frame>
      <Lens {...args}>
        <Photo />
      </Lens>
    </Frame>
  ),
};

/**
 * Static — `isStatic` pins the lens to a fixed position so it&apos;s always
 * visible. `position` is the centre of the magnified circle.
 */
export const Static: Story = {
  args: {
    isStatic: true,
    zoomFactor: 2,
    lensSize: 200,
    position: { x: 240, y: 160 },
  },
  render: (args) => (
    <Frame>
      <Lens {...args}>
        <Photo />
      </Lens>
    </Frame>
  ),
};

/** Over text — usable on any block content, not just images. */
export const OverText: Story = {
  args: { zoomFactor: 2, lensSize: 200 },
  render: (args) => (
    <Frame>
      <Lens {...args}>
        <div className="bg-card text-foreground rounded-lg p-8 text-sm leading-relaxed">
          <h3 className="mb-2 text-2xl font-semibold">Read the fine print</h3>
          <p>
            The Indiecrafts template ships with WCAG AA contrast verification, full i18n
            routing via next-intl, and a config-first architecture that turns rebrands
            into a single commit. Every section blueprint is type-safe end to end. Hover
            this card to inspect the typography up close — the lens magnifies any HTML,
            not just images.
          </p>
        </div>
      </Lens>
    </Frame>
  ),
};
