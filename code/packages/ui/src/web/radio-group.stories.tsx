import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import docs from "./radio-group.md?raw";
import { Label } from "./label";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="r1" />
        <Label htmlFor="r1">Standard</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="express" id="r2" />
        <Label htmlFor="r2">Express</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="overnight" id="r3" />
        <Label htmlFor="r3">Overnight</Label>
      </div>
    </RadioGroup>
  ),
};
