import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud11Section } from "./index";
import { logoCloud11Sample } from "./config";

const meta: Meta<typeof LogoCloud11Section> = {
  title: "Sections/LogoCloud/LogoCloud11",
  component: LogoCloud11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud11Section>;

export const Default: Story = {
  args: { ...logoCloud11Sample, id: "story-logo-cloud-11" } as React.ComponentProps<
    typeof LogoCloud11Section
  >,
};
