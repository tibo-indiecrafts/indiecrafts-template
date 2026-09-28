import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundContent } from "./NotFoundContent";
import { SHELL_COPY } from "../shared";

const meta = {
  title: "Native/System Pages/NotFoundContent",
  component: NotFoundContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { ...SHELL_COPY.en.notFound },
} satisfies Meta<typeof NotFoundContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const French: Story = { args: { ...SHELL_COPY.fr.notFound } };
