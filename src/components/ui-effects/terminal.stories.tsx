import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedSpan, Terminal, TypingAnimation } from "./terminal";

const meta: Meta<typeof Terminal> = {
  title: "UI Effects/3D & Devices/Terminal",
  component: Terminal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Terminal>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
    <div className="w-[640px] max-w-full">{children}</div>
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <Terminal>
        <TypingAnimation>$ pnpm dev</TypingAnimation>
        <AnimatedSpan delay={1500} className="text-emerald-500">
          ✓ Ready in 0.4s
        </AnimatedSpan>
        <AnimatedSpan delay={2200}>- Local: http://localhost:3000</AnimatedSpan>
      </Terminal>
    </Stage>
  ),
};

export const BuildScript: Story = {
  render: () => (
    <Stage>
      <Terminal>
        <TypingAnimation>$ pnpm verify</TypingAnimation>
        <AnimatedSpan delay={1200} className="text-cyan-400">
          ▸ Type-checking
        </AnimatedSpan>
        <AnimatedSpan delay={1800} className="text-emerald-500">
          ✓ tsc clean
        </AnimatedSpan>
        <AnimatedSpan delay={2400} className="text-cyan-400">
          ▸ Linting
        </AnimatedSpan>
        <AnimatedSpan delay={3000} className="text-emerald-500">
          ✓ 0 problems
        </AnimatedSpan>
        <AnimatedSpan delay={3600} className="text-cyan-400">
          ▸ Contrast verification
        </AnimatedSpan>
        <AnimatedSpan delay={4200} className="text-emerald-500">
          ✓ All token pairs meet WCAG AA
        </AnimatedSpan>
      </Terminal>
    </Stage>
  ),
};

export const Error: Story = {
  render: () => (
    <Stage>
      <Terminal>
        <TypingAnimation>$ pnpm tsc</TypingAnimation>
        <AnimatedSpan delay={1500} className="text-rose-500">
          src/components/ui/foo.tsx:14:5 - error TS2322:
        </AnimatedSpan>
        <AnimatedSpan delay={2100}>
          {"  "}Type &apos;string&apos; is not assignable to type &apos;number&apos;.
        </AnimatedSpan>
        <AnimatedSpan delay={2700} className="text-rose-500">
          Found 1 error in 1 file.
        </AnimatedSpan>
      </Terminal>
    </Stage>
  ),
};

export const NoSequence: Story = {
  render: () => (
    <Stage>
      <Terminal sequence={false}>
        <TypingAnimation>$ git status</TypingAnimation>
        <AnimatedSpan className="text-muted-foreground">On branch main</AnimatedSpan>
        <AnimatedSpan className="text-emerald-500">
          nothing to commit, working tree clean
        </AnimatedSpan>
      </Terminal>
    </Stage>
  ),
};

export const StartOnView: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background w-full">
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Scroll down — the terminal starts only when it enters the viewport.
        </p>
      </div>
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-[640px] max-w-full">
          <Terminal startOnView>
            <TypingAnimation>$ ls -la src/</TypingAnimation>
            <AnimatedSpan delay={1200}>app/</AnimatedSpan>
            <AnimatedSpan delay={1500}>components/</AnimatedSpan>
            <AnimatedSpan delay={1800}>config/</AnimatedSpan>
            <AnimatedSpan delay={2100}>i18n/</AnimatedSpan>
            <AnimatedSpan delay={2400}>lib/</AnimatedSpan>
          </Terminal>
        </div>
      </div>
    </div>
  ),
};
