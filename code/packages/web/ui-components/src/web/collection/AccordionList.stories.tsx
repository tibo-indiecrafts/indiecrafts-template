import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { AccordionList } from "./AccordionList";
import { portableComponents } from "../portable-text-components";
import { body } from "../_mock";
import docs from "./AccordionList.md?raw";

const meta = {
  title: "UI Components/AccordionList",
  component: AccordionList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.accordion-list",
    title: "FAQ",
    items: [
      {
        _key: "i1",
        title: "Is it free?",
        content: body("The template is yours to configure."),
      },
      {
        _key: "i2",
        title: "Can I toggle features?",
        content: body("Yes — every feature has a flag."),
      },
      {
        _key: "i3",
        title: "Does it need JS?",
        content: body("The accordion uses native <details>."),
      },
    ],
    components: portableComponents,
  },
  argTypes: {
    items: { table: { disable: true } },
    components: { table: { disable: true } },
    inline: { control: "boolean" },
  },
} satisfies Meta<typeof AccordionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: clicking an item summary opens its native `<details>` content. */
export const Expands: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Is it free?"));
    await expect(
      await canvas.findByText("The template is yours to configure."),
    ).toBeVisible();
  },
};
