import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Landing1 } from "./Landing1";

const meta: Meta<typeof Landing1> = {
  title: "Pages/Marketing/Landing1",
  component: Landing1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Landing1>;

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
