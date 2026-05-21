import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SpinningText } from "./index";

const meta: Meta<typeof SpinningText> = {
  title: "UI Effects/Text/SpinningText",
  component: SpinningText,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SpinningText>;

export const Basic: Story = {
  render: () => (
    <div className="grid size-[280px] place-items-center">
      <SpinningText radius={5} fontSize={1.2} className="leading-none font-medium">
        {"pre-order • pre-order • pre-order • "}
      </SpinningText>
    </div>
  ),
};

export const CustomTransition: Story = {
  render: () => (
    <div className="grid size-[360px] place-items-center">
      <SpinningText
        radius={7}
        fontSize={1}
        duration={6}
        transition={{ ease: "easeInOut", repeat: Infinity }}
        className="font-mono"
      >
        {"motion-primitives • motion-primitives • "}
      </SpinningText>
    </div>
  ),
};

export const CustomVariants: Story = {
  render: () => (
    <div className="grid size-[300px] place-items-center">
      <SpinningText
        radius={5.5}
        fontSize={1}
        variants={{
          container: {
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              rotate: 360,
              transition: {
                type: "spring",
                bounce: 0,
                duration: 6,
                repeat: Infinity,
                staggerChildren: 0.03,
              },
            },
          },
          item: {
            hidden: { opacity: 0, filter: "blur(4px)" },
            visible: { opacity: 1, filter: "blur(0px)" },
          },
        }}
        className="font-[450]"
      >
        {"pre-order • pre-order • pre-order • "}
      </SpinningText>
    </div>
  ),
};
