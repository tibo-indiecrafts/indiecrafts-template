import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { LocalePreferencePanel } from "./LocalePreferencePanel";

/**
 * Client wrapper around the shared `LocalePreferenceForm`, supplying Clerk's
 * `getToken` (mocked — see `.storybook/clerk-mock.tsx`). Copy matches
 * `LocalePreferenceForm.stories.tsx`'s shape.
 */
const meta = {
  title: "Website/Account/LocalePreferencePanel",
  component: LocalePreferencePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
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
  },
} satisfies Meta<typeof LocalePreferencePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Language")).toHaveValue("en");
  },
};

/** Behavior: picking a language updates the select. */
export const SelectsLocale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Language");
    await userEvent.selectOptions(select, "fr");
    await expect(select).toHaveValue("fr");
  },
};
