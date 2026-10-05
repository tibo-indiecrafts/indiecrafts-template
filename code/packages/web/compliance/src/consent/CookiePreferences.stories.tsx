import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CookiePreferences } from "./CookiePreferences";
import { STORAGE_KEY } from "./consent-store";

/**
 * The website's cookie-preferences dialog (opened by the banner's "Customize" and the
 * footer "Manage preferences"). Required categories are locked on; "Save choices" records
 * every optional category — untouched ones as refused. Copy from `messages` (`cookies.*`).
 */
const meta = {
  title: "Compliance/CookiePreferences",
  component: CookiePreferences,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    categories: [
      {
        key: "necessary",
        title: "Necessary",
        description:
          "Required for the site to work (language, consent). Always on.",
        required: true,
        signals: ["security_storage"],
      },
      {
        key: "analytics",
        title: "Analytics",
        description: "Help us understand how the site is used, anonymously.",
        signals: ["analytics_storage"],
      },
      {
        key: "marketing",
        title: "Marketing",
        description: "Used to measure ad campaigns and show relevant ads.",
        signals: ["ad_storage", "ad_user_data", "ad_personalization"],
      },
      {
        key: "preferences",
        title: "Preferences",
        description: "Remember choices like your theme or embedded content.",
        signals: ["functionality_storage", "personalization_storage"],
      },
    ],
    version: "1",
    open: true,
    onOpenChange: fn(),
    current: {},
  },
  beforeEach: () => localStorage.removeItem(STORAGE_KEY),
} satisfies Meta<typeof CookiePreferences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: turning Analytics on and saving stores analytics on and every other category refused. */
export const SavesEveryCategory: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(body.getByRole("switch", { name: "Analytics" }));
    await userEvent.click(body.getByRole("button", { name: /save/i }));
    await expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}").choices,
    ).toEqual({
      analytics: true,
      marketing: false,
      preferences: false,
    });
  },
};
