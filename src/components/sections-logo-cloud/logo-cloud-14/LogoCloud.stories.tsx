import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud14Section } from "./index";
import { logoCloud14Sample } from "./config";

const meta: Meta<typeof LogoCloud14Section> = {
  title: "Sections/LogoCloud/LogoCloud14",
  component: LogoCloud14Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud14Section>;
export const Default: Story = {
  args: { ...logoCloud14Sample, id: "story-logo-cloud-14" } as React.ComponentProps<
    typeof LogoCloud14Section
  >,
};
