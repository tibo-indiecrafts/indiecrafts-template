import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MagicCard } from "./magic-card";

const meta: Meta<typeof MagicCard> = {
  title: "UI Effects/MagicCard",
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

const CardBody = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => (
  <div className="text-foreground p-8">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 text-sm">{body}</p>
  </div>
);

/**
 * Default — `mode="gradient"`. Hover the card to see a radial gradient track
 * the cursor while the border lights up with the default purple/pink stops.
 */
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

/**
 * Brand gradient — `gradientFrom` / `gradientTo` swap the border ring
 * colours to the template&apos;s indigo-tinted brand. The `var(--color-primary)`
 * resolves at render time so a rebrand updates this card automatically.
 */
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

/** Larger spotlight — `gradientSize={400}` widens the radial halo. */
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

/**
 * Orb mode — `mode="orb"` adds a blurred floating orb that follows the cursor
 * with spring physics. `glowFrom` / `glowTo` control its gradient.
 */
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

/** Grid — three independent cards. Each tracks its own pointer state. */
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
