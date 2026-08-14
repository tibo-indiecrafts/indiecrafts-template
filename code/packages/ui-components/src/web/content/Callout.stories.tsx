import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Callout } from "./Callout";
import { portableComponents } from "../portable-text-components";
import docs from "./Callout.md?raw";

const body = (text: string) => [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text, marks: [] }],
  },
];

const meta = {
  title: "UI Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.callout",
    variant: "info",
    content: body("Heads up — this ships Friday. Double-check the config first."),
    components: portableComponents,
  },
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "danger"] },
    components: { table: { disable: true } },
    content: { table: { disable: true } },
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { variant: "success" } };
export const Warning: Story = { args: { variant: "warning" } };
export const Danger: Story = { args: { variant: "danger" } };

export const WithCta: Story = {
  args: {
    variant: "info",
    cta: { link: { label: "Read the docs", href: "/docs" }, variant: "primary" },
  },
};
