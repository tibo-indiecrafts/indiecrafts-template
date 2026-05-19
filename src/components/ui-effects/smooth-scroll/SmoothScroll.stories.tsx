import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SmoothScroll } from "./index";

const meta: Meta<typeof SmoothScroll> = {
  title: "UI Effects/Marquees & Scroll/SmoothScroll",
  component: SmoothScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SmoothScroll>;

const GRID_BG =
  "absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]";

export const StickyDemo: Story = {
  render: () => (
    <SmoothScroll>
      <main className="bg-black">
        <div className="wrapper">
          <section className="sticky top-0 grid h-screen w-full place-content-center bg-slate-950 text-white">
            <div className={GRID_BG} aria-hidden="true" />
            <h1 className="px-8 text-center text-6xl leading-[120%] font-semibold tracking-tight 2xl:text-7xl">
              I know exactly what you’re <br /> looking for. Scroll please 👇
            </h1>
          </section>

          <section className="sticky top-0 grid h-screen place-content-center overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-neutral-300 text-black">
            <div className={GRID_BG} aria-hidden="true" />
            <h1 className="px-8 text-center text-4xl leading-[120%] font-semibold tracking-tight 2xl:text-7xl">
              If you don’t like this smooth scroll, <br /> build your own and open-source
              it 💼
            </h1>
          </section>

          <section className="sticky top-0 grid h-screen w-full place-content-center bg-slate-950 text-white">
            <div className={GRID_BG} aria-hidden="true" />
            <h1 className="px-8 text-center text-5xl leading-[120%] font-semibold tracking-tight 2xl:text-7xl">
              Don’t forget to share <br /> this sticky CSS trick 😎
            </h1>
          </section>
        </div>

        <footer className="group bg-slate-950">
          <h1 className="translate-y-20 bg-gradient-to-r from-neutral-400 to-neutral-800 bg-clip-text text-center text-[16vw] leading-[100%] font-semibold tracking-tight text-transparent uppercase transition-transform ease-linear group-hover:translate-y-4">
            ui-layout
          </h1>
          <section className="relative z-10 grid h-40 place-content-center rounded-tl-full rounded-tr-full bg-black text-2xl text-white">
            Thanks for scrolling
          </section>
        </footer>
      </main>
    </SmoothScroll>
  ),
};
