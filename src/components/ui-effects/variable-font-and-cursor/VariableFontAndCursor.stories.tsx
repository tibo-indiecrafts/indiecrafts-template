import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";

import { useMousePosition } from "@/hooks/use-mouse-position";

import { VariableFontAndCursor } from "./index";

const meta: Meta<typeof VariableFontAndCursor> = {
  title: "UI Effects/Text/VariableFontAndCursor",
  component: VariableFontAndCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof VariableFontAndCursor>;

// Google's Recursive supports both wght (300-1000) and slnt (-15..0) axes,
// so the cursor-driven font variation is actually visible.
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

function FancyStage() {
  useGoogleFont(RECURSIVE_FONT_HREF);
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);

  return (
    <div
      ref={containerRef}
      className="bg-background relative h-dvh w-dvw cursor-none items-center justify-center overflow-hidden rounded-lg p-24"
      style={{ fontFamily: "Recursive, system-ui, sans-serif" }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <VariableFontAndCursor
          className="text-5xl text-[#f97316] sm:text-7xl md:text-9xl"
          fontVariationMapping={{
            y: { name: "wght", min: 300, max: 1000 },
            x: { name: "slnt", min: 0, max: -15 },
          }}
          containerRef={containerRef}
        >
          fancy!
        </VariableFontAndCursor>
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col">
        <span className="text-foreground/60 text-xs tabular-nums">
          x: {Math.round(x)}
        </span>
        <span className="text-foreground/60 text-xs tabular-nums">
          y: {Math.round(y)}
        </span>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: "100%",
          transform: `translateX(${x}px)`,
          background: "rgba(0,0,0,0.2)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          transform: `translateY(${y}px)`,
          background: "rgba(0,0,0,0.2)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          height: 14,
          transform: `translate3d(${x - 7}px, ${y - 7}px, 0)`,
          background: "#f97316",
          borderRadius: 3,
          boxShadow: "0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.2)",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    </div>
  );
}

export const Showcase: Story = {
  render: () => <FancyStage />,
};
