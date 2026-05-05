import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Login } from "./Login";

const meta: Meta<typeof Login> = {
  title: "Pages/Login/Login01",
  component: Login,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Login>;

/** Defaults — FullBleedLayout (no header/footer). */
export const Default: Story = {};

/** Show the SiteHeader during sign-in (some brands prefer this). */
export const WithSiteHeader: Story = {
  args: { header: true },
};
