import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";

import { CSSBox, type CSSBoxRef } from "./index";

const meta: Meta<typeof CSSBox> = {
  title: "UI Effects/Hover & Interactions/CSSBox",
  component: CSSBox,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CSSBox>;

interface TextFaceProps {
  texts: string[];
  className?: string;
  /** Face background — needed so faces stay opaque in 3D and back faces
   *  don't bleed through the front. */
  bg: string;
}

function TextFace({ texts, className, bg }: TextFaceProps) {
  return (
    <div className={`flex h-full w-full flex-col ${bg} ${className ?? ""}`}>
      {texts.map((text) => (
        <div key={text} className="font-bold tracking-wider text-[#0015ff]">
          {text}
        </div>
      ))}
    </div>
  );
}

function Stage() {
  const boxRef = useRef<CSSBoxRef>(null);
  return (
    <CSSBox
      ref={boxRef}
      width={200}
      height={200}
      depth={200}
      perspective={600}
      stiffness={100}
      damping={30}
      className="text-3xl"
      faces={{
        front: (
          <TextFace
            bg="bg-white"
            texts={["YOU CAN", "JUST", "DO THINGS"]}
            className="items-end justify-end p-2 text-right select-none"
          />
        ),
        back: (
          <TextFace
            bg="bg-zinc-100"
            texts={["MAKE THINGS", "YOU WISH", "EXISTED"]}
            className="justify-end p-2 text-left select-none"
          />
        ),
        right: (
          <TextFace
            bg="bg-zinc-200"
            texts={["MAKE THINGS", "YOU WISH", "EXISTED"]}
            className="justify-end p-2 text-left select-none"
          />
        ),
        left: (
          <TextFace
            bg="bg-zinc-200"
            texts={["BREAK", "THINGS", "MOVE", "FAST"]}
            className="items-end p-2 select-none"
          />
        ),
        top: (
          <TextFace
            bg="bg-zinc-50"
            texts={["YOU CAN", "JUST", "DO THINGS"]}
            className="items-end justify-end p-2 text-right select-none"
          />
        ),
        bottom: (
          <TextFace
            bg="bg-zinc-50"
            texts={["BREAK", "THINGS", "MOVE", "FAST"]}
            className="items-end p-2 select-none"
          />
        ),
      }}
    />
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
