import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Landing } from "./Landing";

const meta: Meta<typeof Landing> = {
  title: "Pages/Landing/Landing01",
  component: Landing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Landing>;

/** Defaults — DefaultLayout (SiteHeader + sections + SiteFooter). */
export const Default: Story = {};

/** Hide the SiteFooter — useful when stacking the template above another. */
export const NoFooter: Story = {
  args: { footer: false },
};

/** No marketing chrome — sections bleed to the viewport edges. */
export const FullBleed: Story = {
  args: { layout: "full-bleed" },
};
