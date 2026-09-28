import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "./Icon";
import { GLYPHS } from "../shared";

const meta = {
  title: "Web/Icons/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "sparkles", size: 28 },
  argTypes: {
    name: { control: "select", options: GLYPHS },
    size: { control: { type: "range", min: 12, max: 64, step: 2 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllGlyphs: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 20,
        placeItems: "center",
      }}
    >
      {GLYPHS.map((name) => (
        <div
          key={name}
          style={{
            display: "grid",
            placeItems: "center",
            gap: 6,
            fontSize: 11,
          }}
        >
          <Icon {...args} name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
