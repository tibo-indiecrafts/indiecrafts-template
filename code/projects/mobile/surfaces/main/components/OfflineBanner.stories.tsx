import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { OfflineBanner } from "./OfflineBanner";

/**
 * Top connectivity strip, shown only while the device is offline. Connectivity comes
 * from `@react-native-community/netinfo`, stubbed for the browser as a static "online"
 * listener (see `.storybook/netinfo-mock.ts`) — so the reachable state here is
 * "online", which renders nothing.
 */
const meta = {
  title: "Mobile/OfflineBanner",
  component: OfflineBanner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof OfflineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Online (the mock's default) — renders nothing, no crash. */
export const Online: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/offline/i)).not.toBeInTheDocument();
  },
};
