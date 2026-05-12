"use client";

import { LogoIcon } from "@/components/logo";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Openai } from "@/components/ui-primitives/svgs/openai";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";

export const Flow7Illustration = () => {
  return (
    <div aria-hidden className="relative flex w-fit items-center justify-center">
      <style jsx>{`
        @keyframes ai-flow {
          0% {
            stroke-dashoffset: 150;
          }
          100% {
            stroke-dashoffset: 600;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 90 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground/10 pointer-events-none absolute inset-0 m-auto w-3/4 translate-x-2"
      >
        <path
          d="M39.781 0.240967L30.59 16.9517C27.778 22.0645 22.406 25.241 16.571 25.241H0"
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <path
          d="M39.781 59.241L30.59 42.5303C27.778 37.4175 22.406 34.241 16.571 34.241H0"
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <path
          d="M88.7812 9.74097L76.5352 23.067C73.5052 26.3644 69.2323 28.241 64.7543 28.241H35.2812H0.28125"
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <path
          d="M88.7812 49.741L76.5352 36.415C73.5052 33.1176 69.2323 31.241 64.7543 31.241H35.2812H0.28125"
          stroke="currentColor"
          strokeWidth={0.5}
        />

        <path
          d="M39.781 0.240967L30.59 16.9517C27.778 22.0645 22.406 25.241 16.571 25.241H0"
          stroke="#3186FF"
          strokeWidth={0.5}
          strokeDasharray="40 200"
          strokeDashoffset={400}
          className="animate-[ai-flow_4s_ease-in-out_infinite] not-group-hover:hidden not-group-hover:opacity-0"
        />
        <path
          d="M39.781 59.241L30.59 42.5303C27.778 37.4175 22.406 34.241 16.571 34.241H0"
          stroke="var(--color-foreground)"
          strokeWidth={0.5}
          strokeDasharray="40 200"
          strokeDashoffset={400}
          className="animate-[ai-flow_4s_ease-in-out_infinite] not-group-hover:hidden not-group-hover:opacity-0"
        />
        <path
          d="M88.7812 9.74097L76.5352 23.067C73.5052 26.3644 69.2323 28.241 64.7543 28.241H35.2812H0.28125"
          stroke="#D97757"
          strokeWidth={0.5}
          strokeDasharray="40 200"
          strokeDashoffset={400}
          className="animate-[ai-flow_4s_ease-in-out_infinite] not-group-hover:hidden not-group-hover:opacity-0"
        />
        <path
          d="M88.7812 49.741L76.5352 36.415C73.5052 33.1176 69.2323 31.241 64.7543 31.241H35.2812H0.28125"
          stroke="#EB5829"
          strokeWidth={0.5}
          strokeDasharray="40 200"
          strokeDashoffset={400}
          className="animate-[ai-flow_4s_ease-in-out_infinite] not-group-hover:hidden not-group-hover:opacity-0"
        />
      </svg>

      <div className="relative flex items-center gap-17">
        <div className="dark:bg-illustration/75 dark:ring-border-illustration relative flex size-12 items-center justify-center rounded-full bg-black/75 shadow-xl ring-1 shadow-black/20 ring-black backdrop-blur">
          <LogoIcon className="size-5" />
        </div>

        <div className="flex flex-col gap-24">
          <div className="ring-border-illustration bg-illustration/50 flex size-12 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
            <Gemini />
          </div>
          <div className="ring-border-illustration bg-illustration/50 flex size-12 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
            <Openai className="*:fill-foreground" />
          </div>
        </div>
        <div className="flex flex-col gap-14">
          <div className="ring-border-illustration bg-illustration/50 flex size-12 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
            <Claude />
          </div>
          <div className="ring-border-illustration bg-illustration/50 flex size-12 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
            <MistralAi />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow7Illustration;
