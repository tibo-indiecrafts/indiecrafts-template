import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextReveal } from "./text-reveal";

const meta: Meta<typeof TextReveal> = {
  title: "UI Effects/Text/TextReveal",
  component: TextReveal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextReveal>;

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-white dark:bg-slate-950">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Page>
      <TextReveal>
        Scroll to reveal this text word by word — a classic editorial reveal powered by
        scroll progress.
      </TextReveal>
    </Page>
  ),
};

export const LongCopy: Story = {
  render: () => (
    <Page>
      <TextReveal>
        Indiecrafts is a config-first Next.js template built for indie hackers who ship
        one client site per week. Every brand string, locale, and section blueprint lives
        in src/config — fork once, customise via data, skip the boilerplate.
      </TextReveal>
    </Page>
  ),
};

export const Manifesto: Story = {
  render: () => (
    <Page>
      <TextReveal>Build small. Ship often. Care about the details.</TextReveal>
    </Page>
  ),
};

export const BrandColored: Story = {
  render: () => (
    <Page>
      <TextReveal className="[&_span]:text-primary">
        Bold brand-tinted reveal that stands out from the page as you scroll.
      </TextReveal>
    </Page>
  ),
};

export const OnDark: Story = {
  render: () => (
    <div className="dark w-full bg-slate-950">
      <TextReveal>
        Inverted theme — dark variants resolve to white text on a deep slate background.
      </TextReveal>
    </div>
  ),
};
