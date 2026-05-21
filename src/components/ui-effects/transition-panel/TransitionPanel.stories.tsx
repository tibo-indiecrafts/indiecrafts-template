import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import useMeasure from "react-use-measure";

import { TransitionPanel } from "./index";

const meta: Meta<typeof TransitionPanel> = {
  title: "UI Effects/Cards/TransitionPanel",
  component: TransitionPanel,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TransitionPanel>;

export const Tabs: Story = {
  render: () => {
    function Demo() {
      const [activeIndex, setActiveIndex] = React.useState(0);
      const ITEMS = [
        {
          title: "Aesthetics",
          subtitle: "Refining Visual Harmony",
          content:
            "Explore the principles of motion aesthetics that enhance the visual appeal of interfaces. Learn to balance timing, easing, and the flow of motion to create seamless user experiences.",
        },
        {
          title: "Art",
          subtitle: "Narrative and Expression",
          content:
            "Delve into how motion can be used as an artistic tool to tell stories and evoke emotions, making digital interactions feel more human and expressive.",
        },
        {
          title: "Technique",
          subtitle: "Mastering Motion Tools",
          content:
            "Gain proficiency in advanced techniques such as physics-based animations, 3D transformations, and complex sequencing to elevate your design skills and implementation.",
        },
      ];

      return (
        <div className="w-[480px] max-w-full">
          <div className="mb-4 flex space-x-2">
            {ITEMS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  activeIndex === index
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
            <TransitionPanel
              activeIndex={activeIndex}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              variants={{
                enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                center: { opacity: 1, y: 0, filter: "blur(0px)" },
                exit: { opacity: 0, y: 50, filter: "blur(4px)" },
              }}
            >
              {ITEMS.map((item) => (
                <div key={item.title} className="py-2">
                  <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-100">
                    {item.subtitle}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.content}</p>
                </div>
              ))}
            </TransitionPanel>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Wizard: Story = {
  render: () => {
    function NavButton({
      onClick,
      children,
    }: {
      onClick: () => void;
      children: React.ReactNode;
    }) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="relative flex h-8 shrink-0 items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          {children}
        </button>
      );
    }

    function Demo() {
      const [activeIndex, setActiveIndex] = React.useState(0);
      const [direction, setDirection] = React.useState(1);
      const [ref, bounds] = useMeasure();

      const FEATURES = [
        {
          title: "Brand",
          description:
            "Develop a distinctive brand identity with tailored logos and guidelines to ensure consistent messaging across all platforms.",
        },
        {
          title: "Product",
          description:
            "Design and refine products that excel in user experience, meeting needs effectively and creating memorable interactions.",
        },
        {
          title: "Website",
          description:
            "Create impactful websites that combine beautiful aesthetics with functional design, ensuring a superior online presence.",
        },
        {
          title: "Design System",
          description:
            "Develop a design system that unifies your brand identity, ensuring consistency across all platforms and products.",
        },
      ];

      const handleSetActiveIndex = (newIndex: number) => {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
      };

      return (
        <div className="w-[364px] overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:bg-zinc-700">
          <TransitionPanel
            activeIndex={activeIndex}
            custom={direction}
            variants={{
              enter: (d: number) => ({
                x: d > 0 ? 364 : -364,
                opacity: 0,
                height: bounds.height > 0 ? bounds.height : "auto",
                position: "initial",
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
                height: bounds.height > 0 ? bounds.height : "auto",
              },
              exit: (d: number) => ({
                zIndex: 0,
                x: d < 0 ? 364 : -364,
                opacity: 0,
                position: "absolute",
                top: 0,
                width: "100%",
              }),
            }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {FEATURES.map((feature) => (
              <div key={feature.title} className="px-4 pt-4" ref={ref}>
                <h3 className="mb-0.5 font-medium text-zinc-800 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </TransitionPanel>
          <div className="flex justify-between p-4">
            {activeIndex > 0 ? (
              <NavButton onClick={() => handleSetActiveIndex(activeIndex - 1)}>
                Previous
              </NavButton>
            ) : (
              <div />
            )}
            <NavButton
              onClick={() =>
                activeIndex === FEATURES.length - 1
                  ? null
                  : handleSetActiveIndex(activeIndex + 1)
              }
            >
              {activeIndex === FEATURES.length - 1 ? "Close" : "Next"}
            </NavButton>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
