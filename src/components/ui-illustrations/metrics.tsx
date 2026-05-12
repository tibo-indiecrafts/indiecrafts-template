/* eslint-disable -- Acme Pro upstream illustration kept verbatim */

import { BookOpen, Gem, MoonStar } from "lucide-react";

export const MetricsIllustration = () => {
  return (
    <div
      aria-hidden
      className="-mx-8 h-fit min-w-md mask-b-from-55% px-4 pt-0.5 @2xl:-mx-4 @4xl:-mx-8"
    >
      <div className="relative mx-auto mt-auto h-fit translate-x-1/16 @2xl:translate-x-0 @4xl:translate-x-1/16">
        <div className="bg-illustration/75 ring-border-illustration absolute bottom-0 left-0 z-10 h-fit w-3/4 overflow-hidden rounded-2xl border border-transparent pb-9 shadow-2xl ring-1 shadow-black/15 backdrop-blur @4xl:block">
          <div className="relative space-y-3 p-4">
            <div className="flex items-center gap-1.5">
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <g fill="none">
                  <path
                    fill="#ff6723"
                    d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
                  />
                  <path
                    fill="#ffb02e"
                    d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
                  />
                </g>
              </svg>
              <div className="text-sm font-medium">Steps</div>
            </div>
            <div className="space-y-3">
              <div className="text-muted-foreground border-b border-white/10 pb-3 text-sm font-medium">
                This year, you're walking more on average{" "}
                <span className="text-foreground">than you did in 2023.</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div>
                    <span className="text-foreground align-baseline text-xl font-medium">
                      8,081
                    </span>{" "}
                    <span className="text-placeholder text-xs">Steps/day</span>
                  </div>
                  <div className="flex h-5 items-center rounded bg-gradient-to-r from-indigo-600 to-purple-300 px-2 text-xs text-white">
                    2024
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-foreground align-baseline text-xl font-medium">
                      5,412
                    </span>{" "}
                    <span className="text-placeholder text-xs">Steps/day</span>
                  </div>
                  <div className="bg-muted text-foreground flex h-5 w-2/3 items-center rounded px-2 text-xs">
                    2023
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card ring-border-illustration mx-auto h-96 w-3/4 rounded-2xl border border-transparent px-6 py-4 ring-1 @2xl:h-fit @2xl:w-full @4xl:h-96 @4xl:w-3/4">
          <div className="space-y-2">
            <div>Favorite Kits</div>
            <div className="*:hover:bg-muted -mx-2 flex flex-col gap-0.5 *:cursor-pointer *:rounded-md *:p-2">
              <div className="flex items-center gap-1">
                <QuartzKitLogo />
                <div className="text-xs">Quartz</div>
                <div className="text-muted-foreground ml-auto text-xs">Now</div>
              </div>
              <div className="flex items-center gap-1">
                <DuskKitLogo />
                <div className="text-xs">Dusk</div>
                <div className="text-muted-foreground ml-auto text-xs">12h ago</div>
              </div>
              <div className="flex items-center gap-1">
                <MistKitLogo />
                <div className="text-xs">Mist</div>
                <div className="text-muted-foreground ml-auto text-xs">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuartzKitLogo = () => (
  <div className="relative flex size-5 items-center justify-center rounded bg-linear-to-b from-amber-400 to-rose-500 shadow-md shadow-black/25 before:absolute before:inset-px before:rounded-[3px] before:border before:border-white/40 before:ring-1 before:ring-black/25 dark:before:border-transparent dark:before:ring-white/25">
    <div className="absolute inset-x-px inset-y-1.5 border-y border-dotted border-white/25"></div>
    <div className="absolute inset-x-1.5 inset-y-px border-x border-dotted border-white/25"></div>
    <Gem className="size-3 fill-white stroke-white drop-shadow" />
  </div>
);

const DuskKitLogo = () => (
  <div className="border-background relative flex size-5 items-center justify-center rounded border bg-linear-to-b from-purple-300 to-blue-600 shadow-md ring-1 shadow-black/20 ring-black/10 dark:border-0 dark:inset-shadow-2xs dark:inset-ring dark:shadow-white/10 dark:ring-black/50 dark:inset-shadow-white/25 dark:inset-ring-white/25">
    <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
    <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
    <MoonStar className="size-3 fill-white stroke-white drop-shadow" />
  </div>
);

const MistKitLogo = () => (
  <div className="border-background relative flex size-5 items-center justify-center rounded border bg-linear-to-b from-lime-300 to-teal-600 shadow-md ring-1 shadow-black/20 ring-black/10 dark:border-0 dark:inset-shadow-2xs dark:inset-ring dark:shadow-white/10 dark:ring-black/50 dark:inset-shadow-white/25 dark:inset-ring-white/25">
    <div className="absolute inset-1 aspect-square rounded-full border border-white/35 bg-black/15"></div>
    <div className="absolute inset-px aspect-square rounded-full border border-dashed border-white/25"></div>
    <BookOpen className="size-3 fill-white stroke-white drop-shadow-sm" />
  </div>
);

export default MetricsIllustration;
