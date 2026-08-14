import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NativeSelect, NativeSelectOption } from "./native-select";
import docs from "./native-select.md?raw";

const meta = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: { size: "default" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args} defaultValue="apple">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="orange">Orange</NativeSelectOption>
    </NativeSelect>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
