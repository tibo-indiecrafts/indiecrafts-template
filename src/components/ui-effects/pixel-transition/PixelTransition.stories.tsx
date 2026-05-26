import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PixelTransition } from "./index";

const meta: Meta<typeof PixelTransition> = {
  title: "UI Effects/Animations/PixelTransition",
  component: PixelTransition,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelTransition>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <PixelTransition
        firstContent={
          /* eslint-disable-next-line @next/next/no-img-element -- demo image from external host; component sizes via padding-top aspect-ratio trick which next/image doesn't fit */
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&h=600&fit=crop"
            alt="A cat"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        }
        secondContent={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              backgroundColor: "#111",
            }}
          >
            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
          </div>
        }
        gridSize={8}
        pixelColor="#ffffff"
        once={false}
        animationStepDuration={0.4}
        className="custom-pixel-card"
      />
    </div>
  ),
};
