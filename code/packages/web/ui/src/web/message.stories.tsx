import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Message,
  MessageGroup,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "./message";
import docs from "./message.md?raw";
import { Bubble, BubbleContent } from "./bubble";

const meta = {
  title: "Web/UI/Message",
  component: Message,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MessageGroup className="w-96">
      <Message align="start">
        <MessageAvatar>
          <img
            src="https://picsum.photos/seed/support/32/32"
            alt=""
            className="size-8"
          />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Support</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>How can I help you today?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble variant="default">
            <BubbleContent>I need to change my order.</BubbleContent>
          </Bubble>
          <MessageFooter>Just now</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
};
