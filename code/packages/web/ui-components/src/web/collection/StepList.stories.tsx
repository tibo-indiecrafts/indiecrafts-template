import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepList } from "./StepList";
import { portableComponents } from "../portable-text-components";
import { body } from "../_mock";
import docs from "./StepList.md?raw";

const meta = {
  title: "UI Components/StepList",
  component: StepList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.step-list",
    title: "How it works",
    steps: [
      {
        _key: "s1",
        title: "Clone",
        content: body("Start from the template repo."),
      },
      {
        _key: "s2",
        title: "Configure",
        content: body("Set your brand + feature flags."),
      },
      { _key: "s3", title: "Ship", content: body("Deploy to production.") },
    ],
    components: portableComponents,
  },
  argTypes: {
    steps: { table: { disable: true } },
    components: { table: { disable: true } },
    inline: { control: "boolean" },
  },
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
