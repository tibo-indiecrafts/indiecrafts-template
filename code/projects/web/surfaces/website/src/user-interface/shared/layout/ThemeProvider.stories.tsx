import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Thin client wrapper around `next-themes`. In the app the layout passes server-resolved
 * props (`themeProviderProps`); here the theme is forced to the toolbar's `data-theme`, so
 * the provider never overrides the Light/Dark switch.
 */
const meta = {
  title: "Layout/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    attribute: "data-theme",
    themes: ["light", "dark"],
    children: <ThemeToggle modes={["light", "dark"]} />,
  },
  render: (args) => (
    <ThemeProvider
      {...args}
      forcedTheme={document.documentElement.dataset.theme ?? "light"}
    />
  ),
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Gives its subtree the `useTheme` context — here, the theme toggle. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.common.switchTheme }),
    ).toBeVisible();
  },
};
