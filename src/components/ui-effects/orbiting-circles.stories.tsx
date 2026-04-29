import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Atom,
  Compass,
  Database,
  PenTool,
  Flame,
  GitBranch,
  Globe,
  Layers,
  Palette,
  Rocket,
  Sparkles,
  Star,
} from "lucide-react";
import { OrbitingCircles } from "./orbiting-circles";

const meta: Meta<typeof OrbitingCircles> = {
  title: "UI Effects/OrbitingCircles",
  component: OrbitingCircles,
  parameters: { layout: "centered" },
  argTypes: {
    radius: { control: { type: "range", min: 60, max: 280, step: 10 } },
    duration: { control: { type: "range", min: 5, max: 60, step: 1 } },
    speed: { control: { type: "range", min: 0.25, max: 4, step: 0.25 } },
    iconSize: { control: { type: "range", min: 16, max: 80, step: 4 } },
    reverse: { control: "boolean" },
    path: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof OrbitingCircles>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex h-[480px] w-[480px] items-center justify-center">
    {children}
  </div>
);

const Tile = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-card text-foreground border-border flex h-full w-full items-center justify-center rounded-full border shadow-sm ${className ?? ""}`}
  >
    {children}
  </div>
);

/**
 * Default — six tiles orbiting a centre marker on a 160px circle. The
 * component renders each child at an evenly-spaced angle; bumping the
 * children count auto-distributes them.
 */
export const Default: Story = {
  args: { radius: 160, duration: 20, iconSize: 40 },
  render: (args) => (
    <Stage>
      <span className="text-muted-foreground absolute z-10 text-sm">★</span>
      <OrbitingCircles {...args}>
        {[Atom, Compass, Globe, Layers, Star, Sparkles].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-5" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
    </Stage>
  ),
};

/** Reverse — `reverse` flips the rotation direction. */
export const Reverse: Story = {
  args: { radius: 160, duration: 20, iconSize: 40, reverse: true },
  render: (args) => (
    <Stage>
      <OrbitingCircles {...args}>
        {[Rocket, Flame, GitBranch, PenTool].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-5" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
    </Stage>
  ),
};

/** No path — `path={false}` hides the guide circle. */
export const NoPath: Story = {
  args: { radius: 160, path: false, iconSize: 40 },
  render: (args) => (
    <Stage>
      <OrbitingCircles {...args}>
        {[Atom, Globe, Star].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-5" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
    </Stage>
  ),
};

/** Slow — `speed={0.5}` doubles the orbit duration. */
export const Slow: Story = {
  args: { radius: 160, speed: 0.5, iconSize: 40 },
  render: (args) => (
    <Stage>
      <OrbitingCircles {...args}>
        {[Atom, Compass, Globe, Layers, Star, Sparkles].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-5" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
    </Stage>
  ),
};

/**
 * Concentric — two `OrbitingCircles` nested at different radii (one
 * reversed) for the canonical "solar system" look.
 */
export const Concentric: Story = {
  render: () => (
    <Stage>
      <span className="bg-card border-border text-foreground absolute z-20 flex size-12 items-center justify-center rounded-full border shadow-sm">
        <Database className="size-5" aria-hidden />
      </span>
      <OrbitingCircles radius={100} duration={14} iconSize={32}>
        {[Atom, Sparkles, Star].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-4" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
      <OrbitingCircles radius={180} duration={28} reverse iconSize={40}>
        {[Globe, Compass, Flame, Palette, Rocket].map((Icon, i) => (
          <Tile key={i}>
            <Icon className="size-5" aria-hidden />
          </Tile>
        ))}
      </OrbitingCircles>
    </Stage>
  ),
};
