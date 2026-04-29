import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo, LogoIcon } from "./index";

const meta: Meta<typeof Logo> = {
  title: "Layouts/Shared/Logo",
  component: Logo,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Wordmark: Story = {};

export const Icon: StoryObj<typeof LogoIcon> = {
  render: () => <LogoIcon />,
};

export const Large: Story = {
  args: { iconClassName: "size-12", className: "text-2xl" },
};
