"use client";

import { LogoIcon } from "@/components/logo";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Openai } from "@/components/ui-primitives/svgs/openai";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { QwenLight } from "@/components/ui-primitives/svgs/qwen";
import { Deepseek } from "@/components/ui-primitives/svgs/deepseek";

export const Flow9Illustration = () => {
  return (
    <div aria-hidden className="relative flex w-fit items-center justify-center">
      <style jsx>{`
        @keyframes model-flow {
          0% {
            stroke-dashoffset: 600;
          }
          100% {
            stroke-dashoffset: 100;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 250 251"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground/10 absolute inset-0 my-auto h-86 w-full"
      >
        <path
          d="M0.5 0.5H98.22C115.155 0.5 131.18 8.16351 141.811 21.3459L209.62 105.429C219.346 117.489 234.007 124.5 249.5 124.5"
          stroke="currentColor"
        />
        <path
          d="M0.5 250.5H99.6904C116.586 250.5 132.579 242.872 143.211 229.741L211.211 145.763C220.566 134.211 234.636 127.5 249.5 127.5"
          stroke="currentColor"
        />
        <path
          d="M51 200.5H98.879C115.437 200.5 131.146 193.173 141.786 180.486L160.214 158.514C170.854 145.827 186.563 138.5 203.121 138.5H249.5"
          stroke="currentColor"
        />
        <path
          d="M50.5 50.5H98.051C115.082 50.5 131.188 58.2506 141.814 71.5602L157.686 91.4398C168.312 104.749 184.418 112.5 201.449 112.5H249.5"
          stroke="currentColor"
        />
        <path
          d="M100.5 100.5H109.607C119.626 100.5 129.403 103.582 137.61 109.327C145.681 114.977 155.272 118.053 165.123 118.152L249.5 119"
          stroke="currentColor"
        />
        <path
          d="M100.5 150.5H109.742C119.673 150.5 129.364 147.445 137.5 141.75C145.636 136.055 155.327 133 165.258 133H249.5"
          stroke="currentColor"
        />

        {/* animated paths */}

        <path
          d="M0.5 0.5H98.22C115.155 0.5 131.18 8.16351 141.811 21.3459L209.62 105.429C219.346 117.489 234.007 124.5 249.5 124.5"
          stroke="url(#gemini)"
          strokeLinecap="round"
          strokeDasharray="50 440"
          strokeDashoffset="300"
          className="animate-[model-flow_3.5s_ease-in-out_infinite]"
        />
        <path
          d="M0.5 250.5H99.6904C116.586 250.5 132.579 242.872 143.211 229.741L211.211 145.763C220.566 134.211 234.636 127.5 249.5 127.5"
          stroke="var(--color-foreground)"
          strokeLinecap="round"
          strokeDasharray="50 440"
          strokeDashoffset="300"
          className="animate-[model-flow_3.5s_ease-in-out_infinite]"
        />
        <path
          d="M51 200.5H98.879C115.437 200.5 131.146 193.173 141.786 180.486L160.214 158.514C170.854 145.827 186.563 138.5 203.121 138.5H249.5"
          stroke="#D97757"
          strokeLinecap="round"
          strokeDasharray="40 400"
          strokeDashoffset="300"
          className="animate-[model-flow_3s_ease-in-out_infinite]"
        />
        <path
          d="M50.5 50.5H98.051C115.082 50.5 131.188 58.2506 141.814 71.5602L157.686 91.4398C168.312 104.749 184.418 112.5 201.449 112.5H249.5"
          stroke="url(#mistral)"
          strokeLinecap="round"
          strokeDasharray="40 400"
          strokeDashoffset="300"
          className="animate-[model-flow_3s_ease-in-out_infinite]"
        />
        <path
          d="M100.5 100.5H109.607C119.626 100.5 129.403 103.582 137.61 109.327C145.681 114.977 155.272 118.053 165.123 118.152L249.5 119"
          stroke="var(--color-foreground)"
          strokeLinecap="round"
          strokeDasharray="20 400"
          strokeDashoffset="300"
          className="animate-[model-flow_2.5s_ease-in-out_infinite]"
        />
        <path
          d="M100.5 150.5H109.742C119.673 150.5 129.364 147.445 137.5 141.75C145.636 136.055 155.327 133 165.258 133H249.5"
          stroke="#4D6BFE"
          strokeLinecap="round"
          strokeDasharray="20 400"
          strokeDashoffset="300"
          className="animate-[model-flow_2.5s_ease-in-out_infinite]"
        />

        <defs>
          <linearGradient
            id="gemini"
            gradientUnits="userSpaceOnUse"
            x1="60"
            y1="50"
            x2="220"
            y2="50"
          >
            <stop offset="0%" stopColor="#F6C013" />
            <stop offset="50%" stopColor="#FA4340" />
            <stop offset="75%" stopColor="#14BB69" />
            <stop offset="100%" stopColor="#3186FF" />
          </linearGradient>

          <linearGradient
            id="mistral"
            gradientUnits="userSpaceOnUse"
            x1="60"
            y1="50"
            x2="220"
            y2="50"
          >
            <stop offset="0%" stopColor="#F7D046" />
            <stop offset="50%" stopColor="#F2A73B" />
            <stop offset="75%" stopColor="#EE792F" />
            <stop offset="100%" stopColor="#EB5829" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative flex items-center gap-44">
        <div className="flex items-center gap-8">
          <div className="flex h-96 flex-col justify-between">
            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <Gemini />
            </div>

            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <Openai className="*:fill-foreground" />
            </div>
          </div>
          <div className="flex h-60 flex-col justify-between gap-10">
            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <MistralAi />
            </div>
            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <Claude />
            </div>
          </div>
          <div className="flex h-28 flex-col justify-between">
            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <QwenLight />
            </div>

            <div className="ring-border-illustration bg-illustration/50 flex size-10 rounded-full shadow-md ring-1 shadow-black/6.5 backdrop-blur *:m-auto *:size-5">
              <Deepseek />
            </div>
          </div>
        </div>
        <div className="corner-squircle dark:bg-illustration/75 dark:ring-border-illustration relative flex size-16 translate-x-4 items-center justify-center rounded-3xl bg-black/75 shadow-xl ring-1 shadow-black/20 ring-black backdrop-blur">
          <LogoIcon className="size-6" />
        </div>
      </div>
    </div>
  );
};

export default Flow9Illustration;
