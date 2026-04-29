import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "UI Primitives/Card",
  component: Card,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Card>;

/** Standard composition — header + content + footer. */
export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Project Aurora</CardTitle>
        <CardDescription>Cross-functional planning workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Track milestones, share docs, and align reviewers in one place.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
};

/** With `CardAction` — the trailing slot in the header (e.g. a kebab menu). */
export const WithAction: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">$84,210</p>
      </CardContent>
    </Card>
  ),
};

/** Header-only — body omitted; useful as a quick stat card. */
export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[260px]">
      <CardHeader>
        <CardDescription>Active Users</CardDescription>
        <CardTitle className="text-3xl tabular-nums">12,408</CardTitle>
      </CardHeader>
    </Card>
  ),
};

/** Border-driven spacing — `[.border-b]:pb-6` activates when header has a border. */
export const WithDividers: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader className="border-b">
        <CardTitle>Notification preferences</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-muted-foreground text-sm">
          Choose how you want to be notified about activity.
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
};
