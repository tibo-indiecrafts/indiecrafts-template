import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClientTweetCard } from "./client-tweet-card";

const meta: Meta<typeof ClientTweetCard> = {
  title: "UI Effects/Social/ClientTweetCard",
  component: ClientTweetCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Client-side tweet card. Fetches tweet HTML from `react-tweet`'s syndication API, with skeleton + not-found fallbacks built in. Each story renders a different real tweet ID.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ClientTweetCard>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[420px] max-w-full">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <ClientTweetCard id="1668408059125702661" />
    </Frame>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Frame>
      <ClientTweetCard id="1683920951807971329" />
    </Frame>
  ),
};

export const NotFound: Story = {
  render: () => (
    <Frame>
      <ClientTweetCard id="0000000000000000000" />
    </Frame>
  ),
};
