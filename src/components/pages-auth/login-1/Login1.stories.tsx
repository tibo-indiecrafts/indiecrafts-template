import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Login1 } from "./Login1";

const meta: Meta<typeof Login1> = {
  title: "Pages/Auth/Login1",
  component: Login1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Login1>;

/** Defaults — FullBleedLayout (no header/footer). */
export const Default: Story = {};

/** Show the SiteHeader during sign-in (some brands prefer this). */
export const WithSiteHeader: Story = {
  args: { header: true },
};
