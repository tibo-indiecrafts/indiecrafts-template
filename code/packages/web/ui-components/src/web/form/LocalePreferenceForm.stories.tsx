import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { LocalePreferenceForm } from "./LocalePreferenceForm";

/**
 * Language selector for a signed-in user. Clerk-free: the caller passes `getToken`
 * and the api origin. Posts to the worker's `POST /v1/profile/locale` (inert in
 * Storybook — `getToken` resolves a fake token and Save is not exercised here).
 */
const meta = {
  title: "UI Components/LocalePreferenceForm",
  component: LocalePreferenceForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    apiUrl: "https://api.example.com",
    currentLocale: "en",
    locales: [
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
    ],
    copy: {
      heading: "Language",
      description: "Choose the language for emails and notifications.",
      label: "Language",
      save: "Save",
      pending: "Saving…",
      success: "Saved",
      error: "Something went wrong. Please try again.",
    },
    getToken: async () => "demo-token",
  },
} satisfies Meta<typeof LocalePreferenceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: picking a language updates the select. */
export const SelectsLocale: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Language");
    await expect(select).toHaveValue("en");
    await userEvent.selectOptions(select, "fr");
    await expect(select).toHaveValue("fr");
  },
};
