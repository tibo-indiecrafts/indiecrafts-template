import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsersIllustration } from "./users";

const meta: Meta<typeof UsersIllustration> = {
  title: "UI Illustrations/Users",
  component: UsersIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof UsersIllustration>;
export const Default: Story = {};
