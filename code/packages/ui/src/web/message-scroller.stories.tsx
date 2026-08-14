import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "./message-scroller";
import docs from "./message-scroller.md?raw";

const meta = {
  title: "UI/MessageScroller",
  component: MessageScroller,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

const turns = Array.from({ length: 12 }, (_, i) => `Message ${i + 1}`);

export const Default: Story = {
  render: () => (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="h-72 w-80 rounded-lg border">
        <MessageScrollerViewport className="p-4">
          <MessageScrollerContent className="gap-2">
            {turns.map((text, i) => (
              <MessageScrollerItem key={i} messageId={String(i)}>
                {text}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="end" />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
};
