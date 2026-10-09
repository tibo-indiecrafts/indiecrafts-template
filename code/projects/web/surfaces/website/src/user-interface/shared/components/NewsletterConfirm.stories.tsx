import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { NewsletterConfirm } from "./NewsletterConfirm";

// The page passes this namespace's strings as `labels` (extra keys are ignored).
const labels = en.pages.newsletterConfirm;

/**
 * Double opt-in confirm — the interactive half of the newsletter confirm page. It reads the
 * signed token from the URL `#t=` fragment once per page load, so a story (no fragment)
 * shows the "no token" state. The confirm prompt needs a real emailed link; clicking it
 * POSTs to `/api/newsletter/confirm`.
 */
const meta = {
  title: "Components/NewsletterConfirm",
  component: NewsletterConfirm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { labels },
} satisfies Meta<typeof NewsletterConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No token in the URL → the expired-link state, with a way home. */
export const NoToken: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: labels.invalidHeading }),
    ).toBeVisible();
    await expect(canvas.getByRole("link", { name: labels.homeCta })).toHaveAttribute(
      "href",
      "/",
    );
  },
};
