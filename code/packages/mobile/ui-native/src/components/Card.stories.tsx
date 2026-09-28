import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";
import { ThemedText } from "./ThemedText";
import { Button } from "./Button";

const meta = {
  title: "Native/UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 320 }}>
      <ThemedText variant="title">Card title</ThemedText>
      <ThemedText variant="muted">
        A themed surface over the `card` token, with a `border` and the themed
        radius.
      </ThemedText>
      <Button label="Action" variant="primary" />
    </Card>
  ),
};
