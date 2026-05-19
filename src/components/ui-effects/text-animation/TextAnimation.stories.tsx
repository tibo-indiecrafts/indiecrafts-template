import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextAnimation } from "./index";

const meta: Meta<typeof TextAnimation> = {
  title: "UI Effects/Text/TextAnimation",
  component: TextAnimation,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextAnimation>;

export const ScrollShowcase: Story = {
  render: () => (
    <div>
      <div className="grid h-[550px] place-content-center">
        <h1 className="text-5xl font-semibold">Scroll down 👇</h1>
      </div>

      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <TextAnimation
          text="Creative ideas start here."
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              transition: { ease: "linear" },
            },
          }}
          className="mx-auto max-w-md text-7xl font-medium capitalize xl:text-8xl"
        />
      </div>

      <div className="flex h-[80vh] items-center text-left">
        <TextAnimation
          as="p"
          letterAnime
          text="Let’s team up and turn ideas into reality ✨"
          className="max-w-md text-7xl lowercase"
          variants={{
            hidden: { filter: "blur(4px)", opacity: 0, y: 20 },
            visible: {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              transition: { duration: 0.2 },
            },
          }}
        />
      </div>

      <div className="flex h-[80vh] items-center justify-center text-right">
        <TextAnimation
          text="Turning concepts into reality"
          direction="right"
          className="ml-auto max-w-md text-7xl capitalize"
        />
      </div>

      <div className="flex h-[80vh] items-center justify-center text-center">
        <TextAnimation
          text="Dream big, work hard & achieve greatness"
          direction="down"
          lineAnime
          className="mx-auto max-w-md text-7xl capitalize"
        />
      </div>
    </div>
  ),
};
