import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FormLayoutSection from "./FormLayout";
import { formLayout02Sample } from "./config";

const meta: Meta<typeof FormLayoutSection> = {
  title: "Sections/Form/FormLayout02",
  component: FormLayoutSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FormLayoutSection>;

export const Default: Story = {
  args: { ...formLayout02Sample, id: "form-layout-02-default" },
};
