import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import Index from "./index";

/**
 * Home screen (expo-router). Exercises `expo-router`'s `useRouter` (stubbed as a
 * no-op — see `.storybook/expo-router-mock.tsx`) and the native design system
 * (`Screen`/`ThemedText`/`Button`/`Card`).
 */
const meta = {
  title: "Mobile/Screens/Index",
  component: Index,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "indiecrafts" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Sign in" })).toBeVisible();
  },
};
