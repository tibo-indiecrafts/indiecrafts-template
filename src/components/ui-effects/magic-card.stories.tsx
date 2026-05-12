import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MagicCard } from "./magic-card";

const meta: Meta<typeof MagicCard> = {
  title: "UI Effects/Cards/MagicCard",
  component: MagicCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MagicCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[400px] w-full items-center justify-center p-10">
    {children}
  </div>
);

const CardBody = ({ title, body }: { title: string; body: string }) => (
  <div className="text-foreground p-8">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 text-sm">{body}</p>
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <MagicCard className="w-80 rounded-2xl">
        <CardBody
          title="Hover to see magic"
          body="Default mode paints a radial gradient under the cursor and a colourful border ring."
        />
      </MagicCard>
    </Stage>
  ),
};

export const BrandGradient: Story = {
  render: () => (
    <Stage>
      <MagicCard
        className="w-80 rounded-2xl"
        gradientFrom="var(--color-primary)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-primary)"
      >
        <CardBody
          title="Brand gradient"
          body="Pass gradientFrom / gradientTo to retune the border ring colours."
        />
      </MagicCard>
    </Stage>
  ),
};

export const LargeSpotlight: Story = {
  render: () => (
    <Stage>
      <MagicCard className="w-96 rounded-2xl" gradientSize={400}>
        <CardBody
          title="Wide spotlight"
          body="A bigger gradient feels more cinematic on hero cards."
        />
      </MagicCard>
    </Stage>
  ),
};

export const Orb: Story = {
  render: () => (
    <Stage>
      <MagicCard
        mode="orb"
        className="w-80 rounded-2xl"
        glowFrom="#ee4f27"
        glowTo="#6b21ef"
      >
        <CardBody
          title="Orb mode"
          body="A blurred glow drifts behind the cursor with spring physics."
        />
      </MagicCard>
    </Stage>
  ),
};

export const Grid: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid w-full grid-cols-1 gap-6 p-10 md:grid-cols-3">
      {[
        { title: "Fast", body: "Sub-second feedback loops." },
        { title: "Modern", body: "React 19 + Tailwind 4." },
        { title: "Accessible", body: "WCAG AA out of the box." },
      ].map((p) => (
        <MagicCard key={p.title} className="rounded-2xl">
          <CardBody title={p.title} body={p.body} />
        </MagicCard>
      ))}
    </div>
  ),
};
