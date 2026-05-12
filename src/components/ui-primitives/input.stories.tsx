import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "UI Primitives/Input",
  component: Input,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Input>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="grid w-[320px] max-w-full gap-2">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </Frame>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      <Input type="text" placeholder="text" />
      <Input type="email" placeholder="email" />
      <Input type="password" placeholder="password" />
      <Input type="number" placeholder="0" />
      <Input type="search" placeholder="search…" />
      <Input type="tel" placeholder="+1 555 0100" />
      <Input type="url" placeholder="https://" />
      <Input type="date" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Frame>
      <Input placeholder="Disabled" disabled />
    </Frame>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Frame>
      <Input value="acme-prod-2024-q4" readOnly />
    </Frame>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Frame>
      <Label htmlFor="email-bad">Email</Label>
      <Input
        id="email-bad"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="email-bad-error"
      />
      <p id="email-bad-error" className="text-destructive text-xs">
        Enter a valid email address.
      </p>
    </Frame>
  ),
};

export const FilePicker: Story = {
  render: () => (
    <Frame>
      <Label htmlFor="cv">Upload CV</Label>
      <Input id="cv" type="file" />
    </Frame>
  ),
};
