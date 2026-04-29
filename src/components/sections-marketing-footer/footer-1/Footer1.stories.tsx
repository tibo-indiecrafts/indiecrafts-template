import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer1Section } from "./index";
import { footer1Sample } from "./config";

const meta: Meta<typeof Footer1Section> = {
  title: "Sections/Marketing/Footer/Footer1",
  component: Footer1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Footer1Section>;

export const Default: Story = {
  args: { ...footer1Sample, id: "story-footer-1" } as React.ComponentProps<
    typeof Footer1Section
  >,
};
