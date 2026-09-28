import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfflineBanner } from "./OfflineBanner";
import { SHELL_COPY } from "../shared";

const meta = {
  title: "Web/System Pages/OfflineBanner",
  component: OfflineBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { message: SHELL_COPY.en.offline.banner },
} satisfies Meta<typeof OfflineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// `OfflineBanner` self-detects via `useOnlineStatus` and renders null while online, so the
// story renders the strip markup directly to document the offline appearance in Storybook
// (which always runs "online").
export const Default: Story = {
  render: (args) => (
    <div
      role="status"
      aria-live="polite"
      className="bg-secondary text-secondary-foreground px-[var(--gutter,1rem)] py-2 text-center text-sm"
    >
      {args.message}
    </div>
  ),
};
