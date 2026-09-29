import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Prose } from "./Prose";
import { portableComponents } from "../portable-text-components";
import { body } from "../_mock";
import docs from "./Prose.md?raw";

const meta = {
  title: "UI Components/Prose",
  component: Prose,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.prose",
    width: "narrow",
    content: body(
      "A prose block renders long-form PortableText at a comfortable measure, styled by the typography plugin.",
    ),
    components: portableComponents,
  },
  argTypes: {
    width: { control: "inline-radio", options: ["narrow", "wide"] },
    content: { table: { disable: true } },
    components: { table: { disable: true } },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Narrow: Story = {};
export const Wide: Story = { args: { width: "wide" } };
