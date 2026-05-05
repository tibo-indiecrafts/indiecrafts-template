import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiAutocompleteIllustration } from "./ai-autocomplete-illustration";

const meta: Meta<typeof AiAutocompleteIllustration> = {
  title: "UI Illustrations/AiAutocompleteIllustration",
  component: AiAutocompleteIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiAutocompleteIllustration>;

export const Default: Story = {};
