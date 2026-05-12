import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LanguagesIllustration } from "./libre-landing-two-languages-illustration";

const meta: Meta<typeof LanguagesIllustration> = {
  title: "UI Illustrations/Libre Landing Two Languages",
  component: LanguagesIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LanguagesIllustration>;
export const Default: Story = {};
