import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI Primitives/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="grid w-[420px] max-w-full gap-2">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <Label htmlFor="msg">Message</Label>
      <Textarea id="msg" placeholder="Type your message…" />
    </Frame>
  ),
};

/** Pre-filled content — exercises multi-line layout. */
export const WithValue: Story = {
  render: () => (
    <Frame>
      <Textarea
        defaultValue={`Hi team,\n\nQuick update on the migration: we've finished the user table and are moving onto the orders table next week. No downtime expected.\n\n— Jamie`}
        rows={6}
      />
    </Frame>
  ),
};

/** Disabled — opacity + cursor reflect the locked state. */
export const Disabled: Story = {
  render: () => (
    <Frame>
      <Textarea placeholder="Read-only space" disabled />
    </Frame>
  ),
};

/** Invalid — `aria-invalid` styles the ring + border red. */
export const Invalid: Story = {
  render: () => (
    <Frame>
      <Textarea defaultValue="too short" aria-invalid="true" aria-describedby="msg-err" />
      <p id="msg-err" className="text-destructive text-xs">
        Message must be at least 20 characters.
      </p>
    </Frame>
  ),
};
