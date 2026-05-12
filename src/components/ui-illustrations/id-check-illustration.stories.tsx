import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IDCheckIllustration } from "./id-check-illustration";

const meta: Meta<typeof IDCheckIllustration> = {
  title: "UI Illustrations/IDCheck",
  component: IDCheckIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof IDCheckIllustration>;

export const Default: Story = {};
