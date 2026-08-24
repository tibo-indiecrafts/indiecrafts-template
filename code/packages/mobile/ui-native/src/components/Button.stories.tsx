import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { View } from "react-native";
import { Button } from "./Button";

const VARIANTS = ["primary", "secondary", "outline", "destructive"] as const;

const meta = {
  title: "Native/Button",
  component: Button,
  tags: ["autodocs"],
  args: { label: "Save changes", variant: "primary", disabled: false },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    disabled: { control: "boolean" },
    onPress: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant} label={variant} />
      ))}
    </View>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
