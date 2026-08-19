import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";
import docs from "./hover-card.md?raw";
import { Button } from "./button";

const meta = {
  title: "UI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@indiecrafts</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <p className="text-sm">
          The indiecrafts platform — config-first sites for makers, joined
          August 2024.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** Behavior: hovering the trigger reveals the card (after its open delay). */
export const Opens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole("button", { name: "@indiecrafts" }));
    await expect(
      await screen.findByText(
        /config-first sites for makers/,
        {},
        { timeout: 3000 },
      ),
    ).toBeVisible();
  },
};
