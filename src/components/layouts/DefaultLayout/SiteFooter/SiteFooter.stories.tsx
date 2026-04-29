import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "./index";

const meta: Meta<typeof SiteFooter> = {
  title: "Layouts/Default/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};
