import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud13Section } from "./index";
import { logoCloud13Sample } from "./config";

const meta: Meta<typeof LogoCloud13Section> = {
  title: "Sections/LogoCloud/LogoCloud13",
  component: LogoCloud13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud13Section>;
export const Default: Story = {
  args: { ...logoCloud13Sample, id: "story-logo-cloud-13" } as React.ComponentProps<
    typeof LogoCloud13Section
  >,
};
