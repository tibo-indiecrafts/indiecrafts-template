import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GridListSection from "./GridList";
import { gridList02Sample } from "./config";

const meta: Meta<typeof GridListSection> = {
  title: "Sections/Lists/GridList02",
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

/** Default — uses the demo `gridList02People` (4 documenso teammates). */
export const Default: Story = {
  args: { ...gridList02Sample, id: "grid-list-02-default" },
};

/**
 * Custom `people` — demonstrates the data-driven prop pattern. Real
 * consumers replace the demo with their own roster (already translated
 * in their own locale, since `name` / `role` are plain strings, not
 * MessageKeys).
 */
export const WithCustomPeople: Story = {
  args: {
    id: "grid-list-02-custom",
    people: [
      {
        id: "ada",
        name: "Ada Lovelace",
        email: "ada@analytic.studio",
        role: "Founder",
        imageUrl: "https://blocks.so/avatar-01.png",
      },
      {
        id: "alan",
        name: "Alan Turing",
        email: "alan@analytic.studio",
        role: "Cryptographer",
        imageUrl: "https://blocks.so/avatar-02.png",
      },
    ],
  },
};
