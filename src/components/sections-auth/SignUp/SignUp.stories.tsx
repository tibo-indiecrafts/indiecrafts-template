import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpPage } from "./index";

const meta: Meta<typeof SignUpPage> = {
  title: "Sections/Auth/SignUp",
  component: SignUpPage,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {
  render: () => <SignUpPage />,
};

/** Custom routing — `brandHref` and `loginHref` overridden. */
export const CustomLinks: Story = {
  render: () => <SignUpPage brandHref="/home" loginHref="/auth/login" />,
};
