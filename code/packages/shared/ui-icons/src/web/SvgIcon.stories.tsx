import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SvgIcon } from "./SvgIcon";
import { SVGS, type SvgName } from "../shared";

const NAMES = Object.keys(SVGS) as SvgName[];

const meta = {
  title: "Icons/Web/SvgIcon",
  component: SvgIcon,
  tags: ["autodocs"],
  args: { name: NAMES[0], width: 40, height: 40 },
  argTypes: {
    name: { control: "select", options: NAMES },
  },
} satisfies Meta<typeof SvgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSvgs: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "center",
      }}
    >
      {NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: "grid",
            placeItems: "center",
            gap: 6,
            fontSize: 11,
          }}
        >
          <SvgIcon {...args} name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
