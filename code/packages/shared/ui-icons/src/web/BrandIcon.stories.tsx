import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BrandIcon } from "./BrandIcon";
import { BRANDS, type BrandName } from "../shared";

const NAMES = Object.keys(BRANDS) as BrandName[];

const meta = {
  title: "Icons/Web/BrandIcon",
  component: BrandIcon,
  tags: ["autodocs"],
  args: { name: "github", size: 28, brandColor: false },
  argTypes: {
    name: { control: "select", options: NAMES },
    brandColor: { control: "boolean" },
    size: { control: { type: "range", min: 16, max: 64, step: 2 } },
  },
} satisfies Meta<typeof BrandIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllBrands: Story = {
  args: { brandColor: true },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
      {NAMES.map((name) => (
        <div key={name} style={{ display: "grid", placeItems: "center", gap: 6, fontSize: 11 }}>
          <BrandIcon {...args} name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
