import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronDownIcon } from "lucide-react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";
import docs from "./button-group.md?raw";
import { Button } from "./button";

const meta = {
  title: "Web/UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Prev</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Sort</ButtonGroupText>
      <Button>Newest</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More options">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  ),
};
