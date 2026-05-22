import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";

import { BreathingText } from "./index";

const meta: Meta<typeof BreathingText> = {
  title: "UI Effects/Text/BreathingText",
  component: BreathingText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BreathingText>;

// Recursive supports both wght (300-1000) and slnt (-15..0) so the breathing
// animation is actually visible (Geist, the project default, only ships wght).
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

function Stage() {
  useGoogleFont(RECURSIVE_FONT_HREF);
  return (
    <div
      className="flex h-dvh w-dvw flex-row items-center justify-center gap-12 bg-white text-3xl text-black sm:text-4xl md:text-5xl"
      style={{ fontFamily: "Recursive, system-ui, sans-serif" }}
    >
      <BreathingText
        staggerDuration={0.08}
        fromFontVariationSettings="'wght' 300, 'slnt' 0"
        toFontVariationSettings="'wght' 1000, 'slnt' -15"
      >
        overused grotesk
      </BreathingText>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
