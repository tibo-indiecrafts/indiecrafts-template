import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  EmailPreferences,
  type EmailPreferencesData,
} from "./EmailPreferences";

const DATA: EmailPreferencesData = {
  categories: [
    {
      key: "news",
      name: "News",
      description: "Product updates and company news.",
      includeAtSignup: true,
      granted: true,
    },
    {
      key: "offers",
      name: "Offers",
      description: "Discounts and promotions.",
      includeAtSignup: false,
      granted: false,
    },
  ],
  notices: [
    {
      name: "Security alerts",
      description: "Sign-in codes and account-security notices.",
    },
  ],
  marketing_email: true,
};

/**
 * The email preference centre: one switch per Studio category, then the read-only
 * "Account & security" notices. Transport-agnostic — the surface injects `read`/`write`
 * (the account widget's JWT transport, or the public token page).
 */
const meta = {
  title: "Compliance/EmailPreferences",
  component: EmailPreferences,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    read: async () => DATA,
    write: fn(async () => {}),
    chrome: {
      noticesHeading: "Account & security",
      loading: "Loading…",
      error: "Something went wrong.",
      retry: "Try again",
    },
  },
} satisfies Meta<typeof EmailPreferences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: a flip writes that one category. */
export const WritesOneCategory: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("switch", { name: /offers/i }),
    );
    await expect(args.write).toHaveBeenCalledWith([
      { key: "offers", granted: true },
    ]);
  },
};

/** A failed load shows the error and a retry, never an empty list. */
export const LoadError: Story = {
  args: { read: async () => Promise.reject(new Error("down")) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "Something went wrong.",
      ),
    );
  },
};
