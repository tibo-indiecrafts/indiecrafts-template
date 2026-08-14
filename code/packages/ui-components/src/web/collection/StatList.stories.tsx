import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatList } from "./StatList";
import docs from "./StatList.md?raw";

const meta = {
  title: "UI Components/StatList",
  component: StatList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.stat-list",
    title: "By the numbers",
    stats: [
      { _key: "a", value: "12k", label: "Users" },
      { _key: "b", value: "99.9%", label: "Uptime" },
      { _key: "c", value: "24/7", label: "Support" },
    ],
  },
  argTypes: { stats: { table: { disable: true } }, inline: { control: "boolean" } },
} satisfies Meta<typeof StatList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeStats: Story = {};
export const FourStats: Story = {
  args: {
    stats: [
      { _key: "a", value: "12k", label: "Users" },
      { _key: "b", value: "99.9%", label: "Uptime" },
      { _key: "c", value: "24/7", label: "Support" },
      { _key: "d", value: "4.9", label: "Rating" },
    ],
  },
};
