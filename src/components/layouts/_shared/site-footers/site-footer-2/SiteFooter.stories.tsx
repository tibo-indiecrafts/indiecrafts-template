import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "./SiteFooter";

const meta: Meta<typeof SiteFooter> = {
  title: "Layouts/Shared/SiteFooters/SiteFooter2",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};
