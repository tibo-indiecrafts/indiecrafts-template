import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiAutocompleteIllustration } from "./ai-autocomplete";

const meta: Meta<typeof AiAutocompleteIllustration> = {
  title: "UI Illustrations/Grid 2 Product Ai Autocomplete",
  component: AiAutocompleteIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiAutocompleteIllustration>;
export const Default: Story = {};
