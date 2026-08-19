import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarIcon } from "lucide-react";
import { Marker, MarkerIcon, MarkerContent } from "./marker";
import docs from "./marker.md?raw";

const meta = {
  title: "UI/Marker",
  component: Marker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Marker className="w-80">
      <MarkerIcon>
        <CalendarIcon />
      </MarkerIcon>
      <MarkerContent>Today</MarkerContent>
    </Marker>
  ),
};

export const Separator: Story = {
  render: () => (
    <Marker variant="separator" className="w-80">
      <MarkerContent>OR</MarkerContent>
    </Marker>
  ),
};

export const Border: Story = {
  render: () => (
    <Marker variant="border" className="w-80">
      <MarkerContent>Yesterday</MarkerContent>
    </Marker>
  ),
};
