import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Transition } from "motion/react";

import { TextHighlighter } from "./index";

const meta: Meta<typeof TextHighlighter> = {
  title: "UI Effects/Text/TextHighlighter",
  component: TextHighlighter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextHighlighter>;

const TRANSITION: Transition = {
  type: "spring",
  duration: 1,
  delay: 0.4,
  bounce: 0,
};
const HIGHLIGHT_CLASS = "rounded-[0.3em] px-px";
const HIGHLIGHT_COLOR = "#F2AD91";
const IN_VIEW = { once: true, initial: true, amount: 0.1 } as const;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-[#fefefe]">
      <div className="pointer-events-none absolute bottom-0 left-0 isolate h-64 w-full bg-gradient-to-t from-[#fefefe] from-10% via-[#fefefe]/50 via-50% to-transparent" />
      <div className="z-10 h-full w-full overflow-scroll bg-[#fefefe]">
        <div className="mx-auto mt-40 max-w-md px-4 pb-64 text-black">
          <h1 className="mb-20 text-4xl font-medium tracking-tight">
            Typeface alphabets
          </h1>

          <div className="text space-y-4 leading-normal">
            <p className="whitespace-break-spaces">
              The present-day designer has a host of printing types at his disposal.{" "}
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                Since Gutenberg first invented movable type in 1436-55
              </TextHighlighter>{" "}
              hundreds of different types have been designed and cast in lead.{" "}
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                The most recent technical developments
              </TextHighlighter>{" "}
              with computer and photo-typesetting have once again brought new faces or
              variations of old ones on the market.
            </p>

            <p>
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                The choice is up to the designer
              </TextHighlighter>{" "}
              It is left to his feeling for form to use{" "}
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                good or poor typefaces
              </TextHighlighter>{" "}
              for his design work.
            </p>

            <p>
              By studying the classic designs of{" "}
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                Garamond, Casion, Bodoni, Walbaum
              </TextHighlighter>{" "}
              and others, the designer can learn what the timeless criteria are which
              produce a refined and artistic typeface.
            </p>

            <p>
              The new typography differs from the old in that it is the first to try to{" "}
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                develop the outward appearance from the function of the text
              </TextHighlighter>
            </p>

            <p>
              <TextHighlighter
                className={HIGHLIGHT_CLASS}
                transition={TRANSITION}
                highlightColor={HIGHLIGHT_COLOR}
                useInViewOptions={IN_VIEW}
              >
                The new typography uses the background
              </TextHighlighter>{" "}
              as an element of design which is on a par with the other elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const HoverTrigger: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#fefefe] text-center text-2xl text-black">
      <p>
        Hover{" "}
        <TextHighlighter
          triggerType="hover"
          className={HIGHLIGHT_CLASS}
          highlightColor={HIGHLIGHT_COLOR}
        >
          this phrase
        </TextHighlighter>{" "}
        to trigger the highlight on demand.
      </p>
    </div>
  ),
};
