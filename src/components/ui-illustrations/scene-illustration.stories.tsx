import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SceneIllustration } from "./scene-illustration";

const meta: Meta<typeof SceneIllustration> = {
  title: "UI Illustrations/Scene",
  component: SceneIllustration,
  parameters: { layout: "centered" },
  argTypes: {
    activeDevice: {
      control: "radio",
      options: [null, "server", "router", "database", "tab", "mobile"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SceneIllustration>;

export const Default: Story = { args: { activeDevice: null } };
export const Server: Story = { args: { activeDevice: "server" } };
export const Router: Story = { args: { activeDevice: "router" } };
export const Database: Story = { args: { activeDevice: "database" } };
export const Tab: Story = { args: { activeDevice: "tab" } };
export const Mobile: Story = { args: { activeDevice: "mobile" } };
