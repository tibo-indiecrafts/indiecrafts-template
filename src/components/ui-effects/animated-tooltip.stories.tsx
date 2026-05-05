import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedTooltip } from "./animated-tooltip";

const meta: Meta<typeof AnimatedTooltip> = {
  title: "UI Effects/Hover & Interactions/AnimatedTooltip",
  component: AnimatedTooltip,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AnimatedTooltip>;

const ITEMS = [
  {
    id: 1,
    name: "Sarah Chen",
    designation: "Product Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    id: 2,
    name: "Marcus Rivera",
    designation: "Lead Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    id: 3,
    name: "Aisha Patel",
    designation: "Frontend Architect",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    id: 4,
    name: "Theo Dubois",
    designation: "Agency Owner",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

/** Default — overlapping avatar group with hover-to-reveal tooltip. */
export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-10">
      <AnimatedTooltip items={ITEMS} />
    </div>
  ),
};

/** Single avatar — proves the tooltip works without the avatar-stack effect. */
export const Single: Story = {
  render: () => (
    <div className="flex items-center justify-center p-10">
      <AnimatedTooltip items={[ITEMS[0]]} />
    </div>
  ),
};

/** Eight avatars — fuller team list, exercises stacking + tilt animation. */
export const LargeTeam: Story = {
  render: () => (
    <div className="flex items-center justify-center p-10">
      <AnimatedTooltip
        items={[
          ...ITEMS,
          {
            id: 5,
            name: "Robin Park",
            designation: "Staff Engineer",
            image:
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
          },
          {
            id: 6,
            name: "Chen Wei",
            designation: "Engineering Manager",
            image:
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
          },
          {
            id: 7,
            name: "Mira Wallace",
            designation: "Brand Designer",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
          },
          {
            id: 8,
            name: "Dario Alves",
            designation: "Customer Success",
            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
          },
        ]}
      />
    </div>
  ),
};

/**
 * Embedded in surrounding chrome — common "Trusted by N people" hero pattern.
 */
export const WithCopy: Story = {
  render: () => (
    <div className="flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <AnimatedTooltip items={ITEMS} />
      <p className="text-muted-foreground text-sm">
        Trusted by 4,000+ teams shipping to production every day.
      </p>
    </div>
  ),
};
