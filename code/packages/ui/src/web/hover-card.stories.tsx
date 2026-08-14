import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./hover-card";
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
