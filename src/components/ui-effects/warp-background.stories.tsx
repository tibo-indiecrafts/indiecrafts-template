import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WarpBackground } from "./warp-background";

const meta: Meta<typeof WarpBackground> = {
  title: "UI Effects/WarpBackground",
  component: WarpBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    perspective: { control: { type: "range", min: 50, max: 400, step: 10 } },
    beamsPerSide: { control: { type: "range", min: 1, max: 12, step: 1 } },
    beamSize: { control: { type: "range", min: 1, max: 20, step: 1 } },
    beamDelayMin: { control: { type: "range", min: 0, max: 5, step: 0.25 } },
    beamDelayMax: { control: { type: "range", min: 1, max: 10, step: 0.25 } },
    beamDuration: { control: { type: "range", min: 1, max: 12, step: 0.5 } },
    gridColor: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof WarpBackground>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[640px] w-full items-center justify-center p-6">
    <div className="w-full max-w-3xl">{children}</div>
  </div>
);

const CardBody = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => (
  <div className="border-border bg-card text-foreground rounded-2xl border p-10 shadow-sm">
    <h2 className="text-3xl font-semibold">{title}</h2>
    <p className="text-muted-foreground mt-3">{body}</p>
  </div>
);

/**
 * Default — colorful beams shoot inward from all four sides on a perspective
 * grid. The content slot sits at the centre, undistorted, while the beams
 * animate around it.
 */
export const Default: Story = {
  render: (args) => (
    <Stage>
      <WarpBackground {...args}>
        <CardBody
          title="Welcome to the warp"
          body="A perspective grid with hue-cycling beams from every side."
        />
      </WarpBackground>
    </Stage>
  ),
};

/** Calm — fewer beams, slower duration. */
export const Calm: Story = {
  args: { beamsPerSide: 2, beamDuration: 7 },
  render: (args) => (
    <Stage>
      <WarpBackground {...args}>
        <CardBody
          title="Calm warp"
          body="Two beams per side, longer duration — much more meditative."
        />
      </WarpBackground>
    </Stage>
  ),
};

/** Dense — `beamsPerSide={8}` for an arcade overload. */
export const Dense: Story = {
  args: { beamsPerSide: 8, beamDuration: 2.5 },
  render: (args) => (
    <Stage>
      <WarpBackground {...args}>
        <CardBody
          title="Hyperspace"
          body="More beams per side and a faster cycle."
        />
      </WarpBackground>
    </Stage>
  ),
};

/**
 * Brand grid — `gridColor` reads from the `--color-primary` token so the
 * perspective grid mirrors the template&apos;s brand at any theme.
 */
export const BrandGrid: Story = {
  args: { gridColor: "var(--color-primary)" },
  render: (args) => (
    <Stage>
      <WarpBackground {...args}>
        <CardBody
          title="Brand grid"
          body="The perspective grid follows --color-primary."
        />
      </WarpBackground>
    </Stage>
  ),
};
