import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchForm } from "./index";

const meta: Meta<typeof SearchForm> = {
  title: "Layouts/Dashboard/Widgets/SearchForm",
  component: SearchForm,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {};
