import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group";
import docs from "./input-group.md?raw";

const meta = {
  title: "Web/UI/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupInput placeholder="mysite" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};
