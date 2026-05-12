import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud12Section } from "./index";
import { logoCloud12Sample } from "./config";

const meta: Meta<typeof LogoCloud12Section> = {
  title: "Sections/LogoCloud/LogoCloud12",
  component: LogoCloud12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud12Section>;

export const Default: Story = {
  args: { ...logoCloud12Sample, id: "story-logo-cloud-12" } as React.ComponentProps<
    typeof LogoCloud12Section
  >,
};
