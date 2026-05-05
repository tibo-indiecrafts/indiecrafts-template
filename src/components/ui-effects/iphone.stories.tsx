import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Iphone } from "./iphone";

const meta: Meta<typeof Iphone> = {
  title: "UI Effects/3D & Devices/Iphone",
  component: Iphone,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Iphone>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[920px] w-full items-center justify-center p-6">
    {children}
  </div>
);

/**
 * Default — empty phone shell. Without `src` or `videoSrc`, the SVG renders
 * the device chassis at its native 433×882 aspect ratio with no media in the
 * screen area.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone />
      </div>
    </Stage>
  ),
};

/** Image content — pass `src` to display a still image inside the screen. */
export const WithImage: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" />
      </div>
    </Stage>
  ),
};

/** Video content — `videoSrc` autoplays a muted, looping clip on the screen. */
export const WithVideo: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      </div>
    </Stage>
  ),
};

/** Larger frame — the wrapper sets the rendered width; the SVG scales with it. */
export const Large: Story = {
  render: () => (
    <Stage>
      <div className="w-[400px]">
        <Iphone src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=1200&q=80" />
      </div>
    </Stage>
  ),
};

/** Small thumbnail — proves the component scales down to compact previews. */
export const Small: Story = {
  render: () => (
    <Stage>
      <div className="w-[160px]">
        <Iphone src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80" />
      </div>
    </Stage>
  ),
};
