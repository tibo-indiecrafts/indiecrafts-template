import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Screen } from "./Screen";
import { ThemedText } from "./ThemedText";

const meta = {
  title: "Native/Screen",
  component: Screen,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

// `Screen` is `flex: 1`, so give it a bounded height in the story canvas.
export const Default: Story = {
  render: () => (
    <Screen style={{ height: 320, padding: 24, gap: 8 }}>
      <ThemedText variant="eyebrow">Screen</ThemedText>
      <ThemedText variant="title">Full-bleed page root</ThemedText>
      <ThemedText variant="muted">
        Painted with the `background` token.
      </ThemedText>
    </Screen>
  ),
};
