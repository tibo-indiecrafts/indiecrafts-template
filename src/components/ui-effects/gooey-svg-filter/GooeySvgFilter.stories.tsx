import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui-primitives/button";
import { useDetectBrowser } from "@/hooks/use-detect-browser";
import { useMedia } from "@/hooks/use-media";

import { GooeySvgFilter } from "./index";

const meta: Meta<typeof GooeySvgFilter> = {
  title: "UI Effects/Filters/GooeySvgFilter",
  component: GooeySvgFilter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GooeySvgFilter>;

const TAB_CONTENT = [
  {
    title: "2024",
    files: [
      "learning-to-meditate.md",
      "spring-garden-plans.md",
      "travel-wishlist.md",
      "new-coding-projects.md",
    ],
  },
  {
    title: "2023",
    files: [
      "year-in-review.md",
      "marathon-training-log.md",
      "recipe-collection.md",
      "book-reflections.md",
    ],
  },
  {
    title: "2022",
    files: [
      "moving-to-a-new-city.md",
      "starting-a-blog.md",
      "photography-basics.md",
      "first-coding-project.md",
    ],
  },
  {
    title: "2021",
    files: [
      "goals-and-aspirations.md",
      "daily-gratitude.md",
      "learning-to-cook.md",
      "remote-work-journal.md",
    ],
  },
];

function GooeyDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(true);
  const isCompact = useMedia("(max-width: 767px)");
  const browserName = useDetectBrowser();
  const isSafari = browserName === "Safari";

  return (
    <div className="relative flex h-dvh w-dvw justify-center bg-zinc-800 p-8 text-xs sm:text-sm md:text-base">
      <GooeySvgFilter id="gooey-filter" strength={isCompact ? 20 : 30} />

      <Button
        variant="outline"
        onClick={() => setIsGooeyEnabled(!isGooeyEnabled)}
        className="absolute top-4 left-4"
      >
        {isGooeyEnabled ? "Disable filter" : "Enable filter"}
      </Button>

      <div className="relative mt-24 w-11/12 md:w-4/5">
        <div
          className="absolute inset-0"
          style={{ filter: isGooeyEnabled ? "url(#gooey-filter)" : "none" }}
        >
          <LayoutGroup>
            <div className="flex w-full">
              {TAB_CONTENT.map((_, index) => (
                <div key={index} className="relative h-8 flex-1 md:h-12">
                  {activeTab === index && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-[#efefef]"
                      transition={{
                        type: "spring",
                        bounce: 0.0,
                        duration: isSafari ? 0 : 0.4,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </LayoutGroup>
          {/* Content panel */}
          <div className="text-muted-foreground h-[200px] w-full overflow-hidden bg-[#efefef] sm:h-[250px] md:h-[300px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 50,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="p-8 md:p-12"
              >
                <div className="mt-4 space-y-2 sm:mt-8 md:mt-8">
                  <ul>
                    {TAB_CONTENT[activeTab].files.map((file) => (
                      <li
                        key={file}
                        className="border-muted-foreground/50 border-b pt-2 pb-1 text-black"
                      >
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive text overlay, no filter */}
        <div className="relative flex w-full">
          {TAB_CONTENT.map((tab, index) => (
            <button
              key={tab.title}
              type="button"
              onClick={() => setActiveTab(index)}
              className="h-8 flex-1 md:h-12"
            >
              <span
                className={`flex h-full w-full items-center justify-center ${
                  activeTab === index ? "text-black" : "text-muted-foreground"
                }`}
              >
                {tab.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <GooeyDemo />,
};
