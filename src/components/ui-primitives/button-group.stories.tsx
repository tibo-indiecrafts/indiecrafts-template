import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bold, ChevronDown, Italic, Underline } from "lucide-react";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "UI Primitives/ButtonGroup",
  component: ButtonGroup,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
};

export const Icons: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon-sm">
        <Bold />
        <span className="sr-only">Bold</span>
      </Button>
      <Button variant="outline" size="icon-sm">
        <Italic />
        <span className="sr-only">Italic</span>
      </Button>
      <Button variant="outline" size="icon-sm">
        <Underline />
        <span className="sr-only">Underline</span>
      </Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText className="px-3 text-xs font-medium">View</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline" size="sm">
        Grid
      </Button>
      <Button variant="outline" size="sm">
        List
      </Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Save</Button>
      <Button size="icon" aria-label="More save options">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  ),
};
