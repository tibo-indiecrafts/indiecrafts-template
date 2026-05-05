import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WorldMap } from "./WorldMap";

const meta: Meta<typeof WorldMap> = {
  title: "UI Effects/Globes & Maps/WorldMap",
  component: WorldMap,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof WorldMap>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background w-[900px] max-w-full">{children}</div>
);

/** Default — three intercontinental arcs from `worldMapDefaultDots`. Decorative. */
export const Default: Story = {
  render: () => (
    <Stage>
      <WorldMap />
    </Stage>
  ),
};

/** Informational — exposes the translated alt to assistive tech. */
export const Informational: Story = {
  render: () => (
    <Stage>
      <WorldMap informational />
    </Stage>
  ),
};

/** Custom dots — caller supplies their own arc set. */
export const CustomRoutes: Story = {
  render: () => (
    <Stage>
      <WorldMap
        dots={[
          {
            start: { lat: 48.8566, lng: 2.3522, label: "PAR" },
            end: { lat: 40.4168, lng: -3.7038, label: "MAD" },
          },
          {
            start: { lat: 40.4168, lng: -3.7038, label: "MAD" },
            end: { lat: 19.4326, lng: -99.1332, label: "MEX" },
          },
        ]}
      />
    </Stage>
  ),
};
