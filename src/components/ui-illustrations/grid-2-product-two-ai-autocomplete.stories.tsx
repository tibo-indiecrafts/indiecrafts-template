import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiAutocompleteIllustration } from "./grid-2-product-two-ai-autocomplete";

const meta: Meta<typeof AiAutocompleteIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Ai Autocomplete",
  component: AiAutocompleteIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiAutocompleteIllustration>;
export const Default: Story = {};
