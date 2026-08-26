import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AuthMenu } from "./AuthMenu";

/**
 * Header auth affordance. Exercises the **Clerk** mock: `AuthMenu` imports
 * `SignedIn` / `SignedOut` / `SignInButton` / `UserButton` from
 * `@indiecrafts/packages-web-auth`, which re-exports from `@clerk/nextjs`
 * (aliased to `.storybook/clerk-mock.tsx`). It also gates on
 * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, bound to a demo value in main.ts.
 *
 * The mock session is signed in, so the account (`UserButton`) placeholder
 * renders and the `SignedOut` / `SignInButton` branch is empty.
 */
const meta = {
  title: "Website/Shared/AuthMenu",
  component: AuthMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuthMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-in: the account button shows (proves the Clerk mock resolved). */
export const SignedInState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("mock-user-button")).toBeInTheDocument();
  },
};
