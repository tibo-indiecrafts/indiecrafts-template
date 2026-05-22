import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";

import { ScrambleIn, type ScrambleInHandle } from "./index";

const meta: Meta<typeof ScrambleIn> = {
  title: "UI Effects/Text/ScrambleIn",
  component: ScrambleIn,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrambleIn>;

const TITLES = [
  "1. One More Time (featuring Romanthony) - 5:20",
  "2. Aerodynamic - 3:27",
  "3. Digital Love - 4:58",
  "4. Harder, Better, Faster, Stronger - 3:45",
  "5. Crescendolls - 3:31",
  "6. Nightvision - 1:44",
  "7. Superheroes - 3:57",
  "8. High Life - 3:22",
  "9. Something About Us - 3:51",
  "10. Voyager - 3:47",
  "11. Veridis Quo - 5:44",
  "12. Short Circuit - 3:26",
  "13. Face to Face (featuring Todd Edwards) - 3:58",
  "14. Too Long (featuring Romanthony) - 10:00",
];

function Tracklist() {
  const scrambleRefs = useRef<(ScrambleInHandle | null)[]>([]);

  useEffect(() => {
    const timers = TITLES.map((_, index) =>
      setTimeout(() => scrambleRefs.current[index]?.start(), index * 50),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-foreground dark:text-muted flex h-dvh w-dvw flex-col items-start justify-start overflow-hidden bg-white px-8 py-16 text-center text-sm font-normal sm:px-16 md:px-20 md:text-lg lg:px-24 lg:text-lg xl:text-xl">
      {TITLES.map((model, index) => (
        <ScrambleIn
          key={model}
          ref={(el) => {
            scrambleRefs.current[index] = el;
          }}
          text={model}
          scrambleSpeed={25}
          scrambledLetterCount={5}
          autoStart={false}
        />
      ))}
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Tracklist />,
};
