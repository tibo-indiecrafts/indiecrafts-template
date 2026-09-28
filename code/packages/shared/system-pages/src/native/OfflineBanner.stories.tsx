import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfflineBanner } from "./OfflineBanner";
import { SHELL_COPY } from "../shared";

/**
 * The native offline strip — a non-blocking top banner shown while `online` is false
 * (renders nothing otherwise). Copy + connectivity are injected; the app owns netinfo
 * detection so the brick stays free of a single-consumer native dep. Rendered in the
 * browser via react-native-web, matching `OfflineContent`.
 */
const meta = {
  title: "Native/System Pages/OfflineBanner",
  component: OfflineBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { message: SHELL_COPY.en.offline.banner, online: false },
} satisfies Meta<typeof OfflineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {};
