import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { AuthMenu } from "./AuthMenu";

/**
 * Header auth affordance. Clerk loads only for a signed-in visitor, so a signed-out
 * visitor gets a plain sign-in link that returns them to the current page. The Clerk
 * menu (signed in) is not shown here: it needs a live Clerk SDK. A demo publishable key
 * is bound in `.storybook-website/main.ts` — without one, auth is off and this renders
 * nothing.
 */
const meta = {
  title: "Layout/AuthMenu",
  component: AuthMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuthMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed out (Clerk not loaded) → a link to the sign-in page with a return URL. */
export const SignedOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: en.nav.signIn });
    await expect(link).toBeVisible();
    await expect(link.getAttribute("href")).toMatch(/sign-in\?redirect_url=/);
  },
};
