import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KeysIllustration } from "./libre-landing-keys-illustration";

const meta: Meta<typeof KeysIllustration> = {
  title: "UI Illustrations/Libre Landing Keys",
  component: KeysIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KeysIllustration>;
export const Default: Story = {};
