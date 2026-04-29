import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BorderBeam } from "./border-beam";

const meta: Meta<typeof BorderBeam> = {
  title: "UI Effects/BorderBeam",
  component: BorderBeam,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BorderBeam>;

const Card = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-card relative h-44 w-[320px] overflow-hidden rounded-2xl border p-6">
    <h3 className="text-lg font-semibold">Pro plan</h3>
    <p className="text-muted-foreground mt-1 text-sm">
      $29 / mo — everything in Free, plus advanced analytics.
    </p>
    {children}
  </div>
);

/** Default — slow orange→violet beam tracing the border. */
export const Default: Story = {
  render: () => (
    <Card>
      <BorderBeam />
    </Card>
  ),
};

/** Fast — `duration={2}` for a snappier orbit. */
export const Fast: Story = {
  render: () => (
    <Card>
      <BorderBeam duration={2} />
    </Card>
  ),
};

/** Reverse — beam orbits counter-clockwise. */
export const Reverse: Story = {
  render: () => (
    <Card>
      <BorderBeam reverse />
    </Card>
  ),
};

/** Custom palette — emerald → cyan instead of the orange/violet default. */
export const CustomColors: Story = {
  render: () => (
    <Card>
      <BorderBeam colorFrom="#10b981" colorTo="#06b6d4" duration={5} />
    </Card>
  ),
};

/** Twin beams — two `BorderBeam`s with opposite `reverse` for a chase effect. */
export const TwinBeams: Story = {
  render: () => (
    <Card>
      <BorderBeam duration={6} colorFrom="#a855f7" colorTo="#ec4899" />
      <BorderBeam reverse duration={6} colorFrom="#22d3ee" colorTo="#3b82f6" />
    </Card>
  ),
};

/** Thick stroke — `borderWidth={3}` for an emphasised outline. */
export const ThickBorder: Story = {
  render: () => (
    <Card>
      <BorderBeam borderWidth={3} size={80} />
    </Card>
  ),
};
