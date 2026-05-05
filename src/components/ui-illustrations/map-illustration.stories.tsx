import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapIllustration } from "./map-illustration";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/MapIllustration",
  component: MapIllustration,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="relative h-64 w-96">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;

export const Default: Story = {};
