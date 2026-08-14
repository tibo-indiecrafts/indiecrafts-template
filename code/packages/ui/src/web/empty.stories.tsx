import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InboxIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./empty";
import docs from "./empty.md?raw";
import { Button } from "./button";

const meta = {
  title: "UI/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty className="w-96 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          Your inbox is empty. Start a conversation to see messages here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>New message</Button>
      </EmptyContent>
    </Empty>
  ),
};
