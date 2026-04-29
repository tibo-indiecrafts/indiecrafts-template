import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NeonGradientCard } from "./neon-gradient-card";

const meta: Meta<typeof NeonGradientCard> = {
  title: "UI Effects/NeonGradientCard",
  component: NeonGradientCard,
  parameters: { layout: "centered" },
  argTypes: {
    borderSize: { control: { type: "range", min: 1, max: 10, step: 1 } },
    borderRadius: { control: { type: "range", min: 0, max: 40, step: 2 } },
  },
};
export default meta;

type Story = StoryObj<typeof NeonGradientCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
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
  <div>
    <h3 className="text-foreground text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 text-sm">{body}</p>
  </div>
);

/**
 * Default — pink + cyan neon gradient that animates around the border via
 * the `--animate-background-position-spin` keyframes. The blurred `::after`
 * adds the outer glow.
 */
export const Default: Story = {
  args: { borderSize: 2, borderRadius: 20 },
  render: (args) => (
    <Stage>
      <NeonGradientCard {...args} className="h-60 w-80">
        <CardBody
          title="Neon edges"
          body="A 2px gradient border with a glowing halo, animated by background position."
        />
      </NeonGradientCard>
    </Stage>
  ),
};

/**
 * Brand colours — `neonColors` swaps the two stops to the template&apos;s
 * brand indigo via the `--color-primary` CSS var. A second darker stop adds
 * depth to the gradient.
 */
export const BrandColors: Story = {
  args: {
    borderSize: 3,
    borderRadius: 20,
    neonColors: {
      firstColor: "var(--color-primary)",
      secondColor: "var(--color-brand-foreground)",
    },
  },
  render: (args) => (
    <Stage>
      <NeonGradientCard {...args} className="h-60 w-80">
        <CardBody
          title="Brand indigo"
          body="Pass neonColors with the brand var to retune the glow."
        />
      </NeonGradientCard>
    </Stage>
  ),
};

/** Thick border — `borderSize={6}` for a chunkier outline. */
export const ThickBorder: Story = {
  args: { borderSize: 6, borderRadius: 24 },
  render: (args) => (
    <Stage>
      <NeonGradientCard {...args} className="h-60 w-80">
        <CardBody
          title="Heavier ring"
          body="Bumping borderSize gives the gradient more presence."
        />
      </NeonGradientCard>
    </Stage>
  ),
};

/** Squared — `borderRadius={4}` for a more architectural shape. */
export const Squared: Story = {
  args: { borderSize: 2, borderRadius: 4 },
  render: (args) => (
    <Stage>
      <NeonGradientCard {...args} className="h-60 w-80">
        <CardBody
          title="Sharp corners"
          body="Drop the rounding to lean into a tech / terminal aesthetic."
        />
      </NeonGradientCard>
    </Stage>
  ),
};

/** Side by side — multiple cards on one canvas, each with its own glow. */
export const SideBySide: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid grid-cols-1 gap-10 p-10 md:grid-cols-3">
      <NeonGradientCard className="h-44">
        <CardBody title="Plan A" body="Solo creators." />
      </NeonGradientCard>
      <NeonGradientCard
        neonColors={{ firstColor: "#22c55e", secondColor: "#84cc16" }}
        className="h-44"
      >
        <CardBody title="Plan B" body="Small studios." />
      </NeonGradientCard>
      <NeonGradientCard
        neonColors={{ firstColor: "#f59e0b", secondColor: "#ec4899" }}
        className="h-44"
      >
        <CardBody title="Plan C" body="Enterprise." />
      </NeonGradientCard>
    </div>
  ),
};
