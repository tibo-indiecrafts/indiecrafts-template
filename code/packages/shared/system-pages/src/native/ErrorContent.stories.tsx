import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorContent } from "./ErrorContent";
import { SHELL_COPY } from "../shared";

const meta = {
  title: "Native/System Pages/ErrorContent",
  component: ErrorContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { ...SHELL_COPY.en.error },
} satisfies Meta<typeof ErrorContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
