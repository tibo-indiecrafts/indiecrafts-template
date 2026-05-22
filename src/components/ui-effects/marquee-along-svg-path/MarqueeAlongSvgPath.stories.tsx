import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MarqueeAlongSvgPath } from "./index";

const meta: Meta<typeof MarqueeAlongSvgPath> = {
  title: "UI Effects/Marquees & Scroll/MarqueeAlongSvgPath",
  component: MarqueeAlongSvgPath,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MarqueeAlongSvgPath>;

const PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const IMAGES = [
  "https://cdn.cosmos.so/b9909337-7a53-48bc-9672-33fbd0f040a1?format=jpeg",
  "https://cdn.cosmos.so/ecdc9dd7-2862-4c28-abb1-dcc0947390f3?format=jpeg",
  "https://cdn.cosmos.so/79de41ec-baa4-4ac0-a9a4-c090005ca640?format=jpeg",
  "https://cdn.cosmos.so/1a18b312-21cd-4484-bce5-9fb7ed1c5e01?format=jpeg",
  "https://cdn.cosmos.so/d765f64f-7a66-462f-8b2d-3d7bc8d7db55?format=jpeg",
  "https://cdn.cosmos.so/6b9f08ea-f0c5-471f-a620-71221ff1fb65?format=jpeg",
  "https://cdn.cosmos.so/40a09525-4b00-4666-86f0-3c45f5d77605?format=jpeg",
  "https://cdn.cosmos.so/14f05ab6-b4d0-4605-9007-8a2190a249d0?format=jpeg",
  "https://cdn.cosmos.so/d05009a2-a2f8-4a4c-a0de-e1b0379dddb8?format=jpeg",
  "https://cdn.cosmos.so/ba646e35-efc2-494a-961b-b40f597e6fc9?format=jpeg",
  "https://cdn.cosmos.so/e899f9c3-ed48-4899-8c16-fbd5a60705da?format=jpeg",
  "https://cdn.cosmos.so/24e83c11-c607-45cd-88fb-5059960b56a0?format=jpeg",
  "https://cdn.cosmos.so/cd346bce-f415-4ea7-8060-99c5f7c1741a?format=jpeg",
];

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-zinc-50">
      <MarqueeAlongSvgPath
        path={PATH}
        viewBox="0 0 996 330"
        baseVelocity={8}
        slowdownOnHover
        draggable
        repeat={2}
        dragSensitivity={0.1}
        className="h-full w-full scale-105"
        responsive
        grabCursor
      >
        {IMAGES.map((src, i) => (
          <div key={src} className="h-full w-14 duration-300 ease-in-out hover:scale-150">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Cosmos URLs */}
            <img
              src={src}
              alt={`Find ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </MarqueeAlongSvgPath>
    </div>
  ),
};
