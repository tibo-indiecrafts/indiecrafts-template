import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FormLayoutSection from "./FormLayout";
import { formLayout05Sample } from "./config";

const meta: Meta<typeof FormLayoutSection> = {
  title: "Sections/Form/FormLayout05",
  component: FormLayoutSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FormLayoutSection>;

export const Default: Story = {
  args: { ...formLayout05Sample, id: "form-layout-05-default" },
};
