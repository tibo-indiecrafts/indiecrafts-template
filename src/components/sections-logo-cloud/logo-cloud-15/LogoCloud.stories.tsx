import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud15Section } from "./index";

const meta: Meta<typeof LogoCloud15Section> = {
  title: "Sections/LogoCloud/LogoCloud15",
  component: LogoCloud15Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud15Section>;
export const Default: Story = { args: { id: "story-logo-cloud-15" } };
