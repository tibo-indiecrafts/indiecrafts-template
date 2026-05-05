/* eslint-disable react/no-unescaped-entities -- shadcn upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Inbox, Plus, Search } from "lucide-react";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

const meta: Meta<typeof Empty> = {
  title: "UI Primitives/Empty",
  component: Empty,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Empty>;

/** Default — title + description, no media or actions. */
export const Default: Story = {
  render: () => (
    <Empty className="w-[420px] border">
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project to start collaborating with your team.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/** With an icon-style media slot. */
export const WithIcon: Story = {
  render: () => (
    <Empty className="w-[420px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Inbox zero</EmptyTitle>
        <EmptyDescription>You're all caught up — no pending messages.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/** With a CTA in `EmptyContent`. */
export const WithAction: Story = {
  render: () => (
    <Empty className="w-[420px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Try a different search term, or create a new entry.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Plus />
          New entry
        </Button>
      </EmptyContent>
    </Empty>
  ),
};
