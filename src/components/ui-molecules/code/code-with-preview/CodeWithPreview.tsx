"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import type { BundledLanguage } from "shiki/bundle/web";
import { CodeBlock } from "@/components/ui-molecules/code/code-block";

const Nextjs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <mask
      id="cwp-nextjs-mask"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={180}
      height={180}
    >
      <circle cx={90} cy={90} r={90} fill="black" />
    </mask>
    <g mask="url(#cwp-nextjs-mask)">
      <circle cx={90} cy={90} r={87} fill="black" stroke="white" strokeWidth={6} />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="url(#cwp-nextjs-grad-1)"
      />
      <rect x={115} y={54} width={12} height={72} fill="url(#cwp-nextjs-grad-2)" />
    </g>
    <defs>
      <linearGradient
        id="cwp-nextjs-grad-1"
        x1={109}
        y1={116.5}
        x2={144.5}
        y2={160.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset={1} stopColor="white" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="cwp-nextjs-grad-2"
        x1={121}
        y1={54}
        x2={120.799}
        y2={106.875}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset={1} stopColor="white" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

const Svelte = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 308"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.198 82.198 0 0 0-37.135 55.056 86.566 86.566 0 0 0 8.536 55.576 82.425 82.425 0 0 0-12.296 30.719 87.596 87.596 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.182 82.182 0 0 0 37.135-55.057 86.601 86.601 0 0 0-8.53-55.577 82.409 82.409 0 0 0 12.29-30.718 87.573 87.573 0 0 0-14.963-66.244"
      fill="#FF3E00"
    />
    <path
      d="M106.889 270.841c-23.102 6.007-47.497-3.036-61.103-22.648a52.685 52.685 0 0 1-9.003-39.85 49.978 49.978 0 0 1 1.713-6.693l1.35-4.115 3.671 2.697a92.447 92.447 0 0 0 28.036 14.007l2.663.808-.245 2.659a16.067 16.067 0 0 0 2.89 10.656 17.143 17.143 0 0 0 18.397 6.828 15.786 15.786 0 0 0 4.403-1.935l71.67-45.672a14.922 14.922 0 0 0 6.734-9.977 15.923 15.923 0 0 0-2.713-12.011 17.156 17.156 0 0 0-18.404-6.832 15.78 15.78 0 0 0-4.396 1.933l-27.35 17.434a52.298 52.298 0 0 1-14.553 6.391c-23.101 6.007-47.497-3.036-61.101-22.649a52.681 52.681 0 0 1-9.004-39.849 49.428 49.428 0 0 1 22.34-33.114l71.664-45.677a52.218 52.218 0 0 1 14.563-6.398c23.101-6.007 47.497 3.036 61.101 22.648a52.685 52.685 0 0 1 9.004 39.85 50.559 50.559 0 0 1-1.713 6.692l-1.35 4.116-3.67-2.693a92.373 92.373 0 0 0-28.037-14.013l-2.664-.809.246-2.658a16.099 16.099 0 0 0-2.89-10.656 17.143 17.143 0 0 0-18.398-6.828 15.786 15.786 0 0 0-4.402 1.935l-71.67 45.674a14.898 14.898 0 0 0-6.73 9.975 15.9 15.9 0 0 0 2.709 12.012 17.156 17.156 0 0 0 18.404 6.832 15.841 15.841 0 0 0 4.402-1.935l27.345-17.427a52.147 52.147 0 0 1 14.552-6.397c23.101-6.006 47.497 3.037 61.102 22.65a52.681 52.681 0 0 1 9.003 39.848 49.453 49.453 0 0 1-22.34 33.12l-71.664 45.673a52.218 52.218 0 0 1-14.563 6.398"
      fill="#FFF"
    />
  </svg>
);

type Language = {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  code: string;
  lang: BundledLanguage;
  theme: string;
};

const NEXTJS_CODE = `import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form action="" className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home"><LogoIcon /></Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Tailark</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">Google</Button>
            <Button type="button" variant="outline">Microsoft</Button>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">Username</Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-title text-sm">Password</Label>
                <Button asChild variant="link" size="sm">
                  <Link href="#">Forgot your Password ?</Link>
                </Button>
              </div>
              <Input type="password" required name="pwd" id="pwd" />
            </div>

            <Button className="w-full">Sign In</Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="#">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
`;

const SVELTE_CODE = `<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
</script>

<section class="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
  <form action="" class="max-w-92 m-auto h-fit w-full">
    <div class="p-6">
      <div>
        <a href="/mist" aria-label="go home">
          <!-- Logo SVG -->
        </a>
        <h1 class="mt-6 text-balance text-xl font-semibold">
          <span class="text-muted-foreground">Welcome back to Tailark!</span> Sign in to continue
        </h1>
      </div>

      <div class="mt-6 space-y-2">
        <Button type="button" variant="outline" size="default" class="w-full">Google</Button>
        <Button type="button" variant="outline" size="default" class="w-full">Facebook</Button>
        <Button type="button" variant="outline" size="default" class="w-full">Microsoft</Button>
      </div>

      <hr class="mb-5 mt-6" />

      <div class="space-y-6">
        <div class="space-y-2">
          <Label for="email" class="block text-sm">Email</Label>
          <Input type="email" required name="email" id="email" placeholder="Your email" />
        </div>

        <Button class="w-full" variant="mdefault" size="default">Continue</Button>
      </div>
    </div>

    <div class="px-6">
      <p class="text-muted-foreground text-sm">
        Don't have an account ?
        <Button href="/signup" variant="link" class="px-2">Create account</Button>
      </p>
    </div>
  </form>
</section>
`;

const LANGUAGES: Language[] = [
  {
    id: "nextjs",
    label: "Next.js",
    Icon: Nextjs,
    code: NEXTJS_CODE,
    lang: "tsx",
    theme: "global",
  },
  {
    id: "svelte",
    label: "Svelte",
    Icon: Svelte,
    code: SVELTE_CODE,
    lang: "svelte",
    theme: "svelte",
  },
];

/**
 * Code-with-preview molecule — split-pane SDK demo with two language
 * tabs (Next.js / Svelte) on the left rendering source code, and a
 * window-chrome card on the right rendering a live React preview.
 * The active tab gets a primary-tinted underline indicator that
 * slides between buttons. Each language carries a `theme` slug
 * applied via `data-theme` to both the indicator and the preview
 * card so the preview re-themes when switching SDKs.
 *
 * The `preview` slot is required — supply any ReactNode (typically
 * a small mock UI illustration like `LoginPreviewIllustration`).
 */
export default function CodeWithPreview({ preview }: { preview: ReactNode }) {
  const [activeId, setActiveId] = useState(LANGUAGES[0].id);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const button = buttonRefs.current[activeId];
    if (!button) return;
    setIndicator({ width: button.offsetWidth, left: button.offsetLeft });
  }, [activeId]);

  const activeLang = LANGUAGES.find((l) => l.id === activeId) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <div className="divide-border/50 bg-background border-border/75 relative divide-dashed rounded-2xl border mask-b-from-75% @3xl:grid @3xl:grid-cols-[1fr_auto] @3xl:divide-x">
        <div className="overflow-hidden rounded-l-2xl pr-px">
          <div className="h-10 px-1.5">
            <div className="relative h-full">
              <div
                data-theme={activeLang.theme}
                className="bg-primary absolute bottom-0 h-px translate-y-px rounded-full duration-300 ease-in-out will-change-auto"
                style={{
                  width: `calc(${indicator.width}px - 16px)`,
                  left: `calc(${indicator.left}px + 8px)`,
                }}
              />
              <div className="relative flex h-full w-fit items-center py-1.5 *:h-full *:rounded-full *:px-2 *:transition-colors *:duration-200">
                {LANGUAGES.map((lang) => {
                  const Icon = lang.Icon;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[lang.id] = el;
                      }}
                      data-state={activeId === lang.id ? "active" : ""}
                      onClick={() => setActiveId(lang.id)}
                      className="text-muted-foreground data-[state=active]:text-foreground hover:bg-foreground/5 flex items-center gap-1.5 text-sm"
                    >
                      <Icon />
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-illustration mb-1 ml-1 rounded-l-lg border-y border-l @max-3xl:mr-1 @max-3xl:rounded-r-lg @max-3xl:border-r">
            <CodeBlock
              code={activeLang.code}
              lang={activeLang.lang}
              maxHeight={521}
              lineNumbers
              className="aspect-4/3 mask-y-from-95% mask-r-from-95% [&_pre]:min-h-[12rem] [&_pre]:border-none [&_pre]:!bg-transparent [&_pre]:pb-0 [&_pre]:pl-2"
            />
          </div>
        </div>
        <div className="relative w-80" />
      </div>
      <div
        data-theme={activeLang.theme}
        className="bg-card ring-border h-fit -translate-y-6 rounded-xl pb-4 shadow-xl ring-1 shadow-black/6.5 @3xl:absolute @3xl:top-0 @3xl:-right-2 @3xl:w-84 @3xl:translate-y-4 dark:shadow-black/50"
      >
        <div className="flex h-9 items-center gap-1.5 px-4">
          <div className="bg-foreground/5 border-foreground/10 size-2 rounded-full border" />
          <div className="bg-foreground/5 border-foreground/10 size-2 rounded-full border" />
          <div className="bg-foreground/5 border-foreground/10 size-2 rounded-full border" />
        </div>
        <div>{preview}</div>
      </div>
    </div>
  );
}
