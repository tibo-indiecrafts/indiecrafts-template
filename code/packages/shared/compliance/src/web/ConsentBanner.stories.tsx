import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ConsentBanner } from "./ConsentBanner";

/**
 * The app's cookie-consent banner (Next-free, copy injected). Accept all · Reject ·
 * Customize; Customize expands the per-category toggles and Save records every optional
 * category (untouched = refused). `copy.learnMore` adds the cookie-policy link.
 */
const meta = {
  title: "Compliance/ConsentBanner",
  component: ConsentBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    categories: [
      {
        key: "necessary",
        title: "Necessary",
        description: "Required for the app to work. Always on.",
        required: true,
      },
      {
        key: "analytics",
        title: "Analytics",
        description: "Helps us understand how the app is used.",
      },
      {
        key: "marketing",
        title: "Marketing",
        description: "Personalized content and offers.",
      },
    ],
    copy: {
      title: "Cookies & privacy",
      body: "We use on-device storage to run the app. Choose what to allow.",
      acceptLabel: "Accept all",
      rejectLabel: "Reject",
      customizeLabel: "Customize",
      saveLabel: "Save",
      backLabel: "Back",
      learnMore: {
        label: "Learn more",
        href: "https://example.com/cookie-policy",
      },
    },
    onAccept: fn(),
    onReject: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof ConsentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without a policy link (`learnMore` omitted). */
export const WithoutLink: Story = {
  args: { copy: { ...meta.args.copy, learnMore: undefined } },
};

/** Behavior: Customize → turn Analytics on → Save records analytics on, marketing refused. */
export const CustomizeAndSave: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Customize" }));
    await userEvent.click(canvas.getByRole("switch", { name: /analytics/i }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(args.onSave).toHaveBeenCalledWith({
      analytics: true,
      marketing: false,
    });
  },
};
