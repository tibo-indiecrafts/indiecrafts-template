import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import SignInScreen from "./sign-in";

/**
 * Sign-in screen (expo-router). Exercises the `@clerk/clerk-expo` mock (signed in by
 * default — see `.storybook/clerk-expo-mock.tsx`), so this renders the signed-in
 * branch (`SignedInView`). `EXPO_PUBLIC_API_URL` is bound to `""`, so the export/delete
 * account sections (which need a real API to call) don't mount.
 */
const meta = {
  title: "Mobile/Screens/SignIn",
  component: SignInScreen,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SignInScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-in (the mock's default): shows the "Continue"/"Sign out" actions. */
export const SignedInState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Continue" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Sign out" })).toBeVisible();
  },
};
