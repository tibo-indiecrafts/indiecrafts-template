import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";

const VARIANTS = ["title", "eyebrow", "body", "muted"] as const;

const meta = {
  title: "Native/ThemedText",
  component: ThemedText,
  tags: ["autodocs"],
  args: { variant: "body", children: "The quick brown fox jumps over the lazy dog." },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
  },
} satisfies Meta<typeof ThemedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <View style={{ gap: 12, maxWidth: 320 }}>
      {VARIANTS.map((variant) => (
        <ThemedText key={variant} {...args} variant={variant}>
          {variant}
        </ThemedText>
      ))}
    </View>
  ),
};
