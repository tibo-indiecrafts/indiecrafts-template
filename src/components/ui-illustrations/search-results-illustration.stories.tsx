import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchResultsIllustration } from "./search-results-illustration";

const meta: Meta<typeof SearchResultsIllustration> = {
  title: "UI Illustrations/Grid 2 Product Search Results",
  component: SearchResultsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SearchResultsIllustration>;
export const Default: Story = {};
