import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";

import { TextCursorProximity } from "./index";

const meta: Meta<typeof TextCursorProximity> = {
  title: "UI Effects/Text/TextCursorProximity",
  component: TextCursorProximity,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextCursorProximity>;

const titleStyles = {
  filter: { from: "blur(0px)", to: "blur(8px)" },
};
const detailStyles = {
  filter: { from: "blur(0px)", to: "blur(4px)" },
};

function DigitalWorkshopCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="flex h-dvh w-dvw flex-col items-center justify-center bg-white p-6 shadow-lg sm:p-12 md:p-16 lg:p-24"
    >
      <div className="relative flex h-2/3 w-full max-w-[400px] min-w-[280px] flex-col items-start justify-between overflow-hidden bg-[#0015ff] p-4 text-white shadow-lg select-none sm:h-full sm:w-4/5 sm:min-w-[350px] md:w-4/5 lg:w-2/3">
        <div className="flex flex-col justify-center -space-y-2 uppercase">
          <TextCursorProximity
            className="text-xl font-bold will-change-transform sm:text-2xl md:text-3xl lg:text-5xl"
            styles={titleStyles}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          >
            DIGITAL
          </TextCursorProximity>
          <TextCursorProximity
            className="text-xl font-bold will-change-transform sm:text-2xl md:text-3xl lg:text-5xl"
            styles={titleStyles}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          >
            WORKSHOP
          </TextCursorProximity>
        </div>

        <div className="flex w-full justify-between font-medium">
          <div className="flex w-full flex-col text-xs leading-tight sm:text-sm md:text-sm lg:text-base">
            <TextCursorProximity
              className="text-left"
              styles={detailStyles}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              LONDON, UK ⟡ 18:30 GMT
            </TextCursorProximity>
            <TextCursorProximity
              className="text-right"
              styles={detailStyles}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              123 DIGITAL STREET, EC1A 1BB ⟶
            </TextCursorProximity>
            <TextCursorProximity
              className="text-left"
              styles={detailStyles}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              +44 20 7123 4567 ⟨⟩ INFO@DIGITAL.WORK
            </TextCursorProximity>
            <TextCursorProximity
              className="text-left"
              styles={detailStyles}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              @DIGITALWORKSHOP * DIGITAL.WORK®
            </TextCursorProximity>
            <TextCursorProximity
              className="text-right"
              styles={detailStyles}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              RSVP REQUIRED ⌲ LIMITED SEATS
            </TextCursorProximity>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <DigitalWorkshopCard />,
};
