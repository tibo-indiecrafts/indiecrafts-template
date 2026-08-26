import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { LocalePreferencePanel } from "./LocalePreferencePanel";

/**
 * Wraps the shared `LocalePreferenceForm` with Clerk's `getToken` (the
 * **Clerk** mock). Network (`/v1/profile/locale`) only happens on Save,
 * never on render — the default story hits no network.
 */
const meta = {
  title: "App/Account/LocalePreferencePanel",
  component: LocalePreferencePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      heading: "Language",
      description: "Choose the language used across the app.",
      label: "Language",
      save: "Save",
      pending: "Saving…",
      success: "Saved.",
      error: "Something went wrong. Please try again.",
    },
    currentLocale: "en",
    locales: [
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
    ],
  },
} satisfies Meta<typeof LocalePreferencePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: saving posts the chosen locale and shows the success status. */
export const SavesLocale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(canvas.getByText("Saved.")).toBeVisible());
    fetchSpy.mockRestore();
  },
};
