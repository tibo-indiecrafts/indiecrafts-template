import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserIcon } from "lucide-react";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from "./item";
import docs from "./item.md?raw";
import { Button } from "./button";

const meta = {
  title: "UI/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ name, email }: { name: string; email: string }) {
  return (
    <Item role="listitem">
      <ItemMedia variant="icon">
        <UserIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
        <ItemDescription>{email}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </ItemActions>
    </Item>
  );
}

export const Default: Story = {
  render: () => (
    <ItemGroup className="w-96 rounded-lg border">
      <Row name="Ada Lovelace" email="ada@example.com · Admin" />
      <ItemSeparator />
      <Row name="Alan Turing" email="alan@example.com · Member" />
    </ItemGroup>
  ),
};
