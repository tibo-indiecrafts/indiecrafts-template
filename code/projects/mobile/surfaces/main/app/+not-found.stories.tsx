import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import NotFound from "./+not-found";

/**
 * Expo Router catch-all 404 screen — the themed, translated not-found screen
 * (`SHELL_COPY.en.notFound`, via `react-intl`). Exercises `expo-router`'s `useRouter`
 * (stubbed as a no-op).
 */
const meta = {
  title: "Mobile/Screens/NotFound",
  component: NotFound,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Page not found")).toBeVisible();
    // getByText (role-agnostic): NotFoundContent's home affordance may not expose a
    // semantic `button` role under react-native-web.
    await expect(canvas.getByText("Go home")).toBeVisible();
  },
};
