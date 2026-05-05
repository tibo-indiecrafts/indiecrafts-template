import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FormLayoutSection from "./FormLayout";
import { formLayout03Sample } from "./config";

const meta: Meta<typeof FormLayoutSection> = {
  title: "Sections/Form/FormLayout03",
  component: FormLayoutSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FormLayoutSection>;

export const Default: Story = {
  args: { ...formLayout03Sample, id: "form-layout-03-default" },
};
