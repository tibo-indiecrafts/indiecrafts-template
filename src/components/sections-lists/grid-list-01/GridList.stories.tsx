import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GridListSection from "./GridList";
import { gridList01Sample } from "./config";

const meta: Meta<typeof GridListSection> = {
  title: "Sections/Lists/GridList01",
  component: GridListSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-full max-w-5xl justify-center pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GridListSection>;

export const Default: Story = {
  args: { ...gridList01Sample, id: "grid-list-01-default" },
};
