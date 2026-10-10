import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarCard } from "./SidebarCard";
import docs from "./SidebarCard.md?raw";

const meta = {
  title: "UI Components/SidebarCard",
  component: SidebarCard,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: {
    type: "module.prose",
    children: (
      <p className="text-sm">
        A block rendered inline. The card draws the frame and sizes it as a
        container.
      </p>
    ),
  },
  argTypes: { children: { table: { disable: true } } },
} satisfies Meta<typeof SidebarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Framed: Story = {};

/** A block that draws its own card (a callout) gets no second frame. */
export const SelfFramed: Story = {
  args: {
    type: "module.callout",
    children: (
      <div
        role="note"
        className="bg-muted ring-border rounded-lg px-5 py-3 text-sm ring-1"
      >
        The callout keeps its own frame.
      </div>
    ),
  },
};
