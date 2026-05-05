import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollVelocityContainer, ScrollVelocityRow } from "./scroll-based-velocity";

const meta: Meta<typeof ScrollVelocityContainer> = {
  title: "UI Effects/Marquees & Scroll/ScrollBasedVelocity",
  component: ScrollVelocityContainer,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollVelocityContainer>;

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-[200vh] w-full">{children}</div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-foreground/40 mx-6 text-7xl font-extrabold tracking-tight italic">
    {children}
  </span>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="border-border bg-card text-foreground mx-3 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap">
    {children}
  </span>
);

/**
 * Default — two opposite-direction marquee rows, both reactive to scroll
 * velocity. Scroll the canvas to see the rows speed up; the
 * `ScrollVelocityContainer` shares one velocity factor across rows.
 */
export const Default: Story = {
  render: () => (
    <Page>
      <ScrollVelocityContainer className="py-20">
        <ScrollVelocityRow baseVelocity={6} direction={1}>
          <Tag>Build</Tag>
          <Tag>Ship</Tag>
          <Tag>Iterate</Tag>
          <Tag>Repeat</Tag>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1}>
          <Tag>Beautiful</Tag>
          <Tag>Modern</Tag>
          <Tag>Accessible</Tag>
          <Tag>Fast</Tag>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </Page>
  ),
};

/** Single row — minimum viable composition. */
export const SingleRow: Story = {
  render: () => (
    <Page>
      <ScrollVelocityContainer className="py-20">
        <ScrollVelocityRow baseVelocity={5}>
          <Tag>Indiecrafts</Tag>
          <Tag>Template</Tag>
          <Tag>Studio</Tag>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </Page>
  ),
};

/** Pill row — pass card/pill children for a logo-cloud style. */
export const PillRow: Story = {
  render: () => (
    <Page>
      <ScrollVelocityContainer className="py-20">
        <ScrollVelocityRow baseVelocity={4}>
          {[
            "TypeScript",
            "Next.js",
            "Tailwind",
            "shadcn/ui",
            "Magic UI",
            "Aceternity",
            "Radix",
            "Vercel",
            "Vite",
          ].map((label) => (
            <Pill key={label}>{label}</Pill>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </Page>
  ),
};

/**
 * No reactivity — `scrollReactivity={false}` keeps the row at a constant
 * speed regardless of scroll velocity.
 */
export const NoScrollReactivity: Story = {
  render: () => (
    <Page>
      <ScrollVelocityContainer className="py-20">
        <ScrollVelocityRow baseVelocity={4} scrollReactivity={false}>
          <Tag>Always</Tag>
          <Tag>Steady</Tag>
          <Tag>Smooth</Tag>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </Page>
  ),
};
