import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { LocaleSuggest } from "./LocaleSuggest";
import docs from "./LocaleSuggest.md?raw";

/**
 * The language-suggestion strip. In the app the copy comes from the `localeSuggest`
 * Sanity singleton and `{language}` is the target language's native name; these
 * stories pass the strings directly. Switch is inert in Storybook.
 */
const meta = {
  title: "Web/Chrome/LocaleSuggest",
  component: LocaleSuggest,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docs } },
  },
  args: {
    suggested: "fr",
    suggestedLabel: "Français",
    message: "This site is also available in {language}.",
    switchLabel: "Switch to {language}",
    dismissLabel: "No thanks",
  },
} satisfies Meta<typeof LocaleSuggest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: the dismiss button removes the strip. */
export const Dismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "No thanks" }));
    await waitFor(() =>
      expect(canvas.queryByRole("region")).not.toBeInTheDocument(),
    );
  },
};
