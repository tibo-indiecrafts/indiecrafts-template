import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FormLayoutSection from "./FormLayout";
import { formLayout04Sample } from "./config";

const meta: Meta<typeof FormLayoutSection> = {
  title: "Sections/Form/FormLayout04",
  component: FormLayoutSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FormLayoutSection>;

export const Default: Story = {
  args: { ...formLayout04Sample, id: "form-layout-04-default" },
};
