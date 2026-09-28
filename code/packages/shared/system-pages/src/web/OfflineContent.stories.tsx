import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfflineContent } from "./OfflineContent";
import { SHELL_COPY } from "../shared";

const { banner: _banner, ...offline } = SHELL_COPY.en.offline;

const meta = {
  title: "Web/System Pages/OfflineContent",
  component: OfflineContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: offline,
} satisfies Meta<typeof OfflineContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
