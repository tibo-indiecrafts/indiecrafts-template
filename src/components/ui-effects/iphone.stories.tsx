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

export const Default: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone />
      </div>
    </Stage>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" />
      </div>
    </Stage>
  ),
};

export const WithVideo: Story = {
  render: () => (
    <Stage>
      <div className="w-[280px]">
        <Iphone videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      </div>
    </Stage>
  ),
};

export const Large: Story = {
  render: () => (
    <Stage>
      <div className="w-[400px]">
        <Iphone src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=1200&q=80" />
      </div>
    </Stage>
  ),
};

export const Small: Story = {
  render: () => (
    <Stage>
      <div className="w-[160px]">
        <Iphone src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80" />
      </div>
    </Stage>
  ),
};
