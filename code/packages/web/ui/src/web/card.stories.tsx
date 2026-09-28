import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";
import docs from "./card.md?raw";
import { Badge } from "./badge";
import { Button } from "./button";

const meta = {
  title: "Web/UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Starter plan</CardTitle>
        <CardDescription>Everything to launch your first site.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          $12<span className="text-muted-foreground text-sm">/mo</span>
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">Choose plan</Button>
        <Button variant="outline">Compare</Button>
      </CardFooter>
    </Card>
  ),
};
