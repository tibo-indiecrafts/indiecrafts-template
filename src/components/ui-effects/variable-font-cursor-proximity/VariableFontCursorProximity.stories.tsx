import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";

import { VariableFontCursorProximity } from "./index";

const meta: Meta<typeof VariableFontCursorProximity> = {
  title: "UI Effects/Text/VariableFontCursorProximity",
  component: VariableFontCursorProximity,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof VariableFontCursorProximity>;

const RECURSIVE_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Recursive:slnt,wght@-15..0,300..1000&display=swap";

function useGoogleFont(href: string) {
  useEffect(() => {
    const id = `gf-${btoa(href)}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [href]);
}

const TEXTS = ["Overstimulated", "Underutilized", "Familiar", "Extraordinary"];

function Stage() {
  useGoogleFont(RECURSIVE_FONT_HREF);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-dvw cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ff5941]"
      style={{ fontFamily: "Recursive, system-ui, sans-serif" }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white">
        {TEXTS.map((text) => (
          <VariableFontCursorProximity
            key={text}
            className="text-4xl leading-none md:text-6xl lg:text-7xl"
            fromFontVariationSettings="'wght' 300, 'slnt' 0"
            toFontVariationSettings="'wght' 1000, 'slnt' -15"
            radius={200}
            containerRef={containerRef}
          >
            {text}
          </VariableFontCursorProximity>
        ))}
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
