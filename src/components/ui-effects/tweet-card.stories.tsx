import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MagicTweet, TweetSkeleton } from "./tweet-card";
// Use the localized wrapper for the "not found" state so the demo
// reflects what consumers should import (`./tweet-not-found`), not the
// upstream's hardcoded English copy.
import { TweetNotFound } from "./tweet-not-found";

const meta: Meta = {
  title: "UI Effects/Social/TweetCard",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
    <div className="w-full max-w-lg">{children}</div>
  </div>
);

// A canned Twitter API response shape, sufficient for `enrichTweet` to render.
const FIXTURE_TWEET = {
  __typename: "Tweet",
  lang: "en",
  favorite_count: 248,
  created_at: "2026-04-12T12:34:00.000Z",
  display_text_range: [0, 162],
  entities: { hashtags: [], urls: [], user_mentions: [], symbols: [] },
  id_str: "1781111111111111111",
  text: "Indiecrafts ships the kind of accessibility defaults you used to add by hand. Skip link, focus rings, locale-aware typography — all wired before page one renders.",
  user: {
    id_str: "1",
    name: "Indiecrafts",
    profile_image_url_https:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
    screen_name: "indiecrafts",
    verified: true,
    is_blue_verified: true,
    profile_image_shape: "Circle",
  },
  edit_control: {
    edit_tweet_ids: ["1781111111111111111"],
    editable_until_msecs: "0",
    is_edit_eligible: false,
    edits_remaining: "5",
  },
  isEdited: false,
  isStaleEdit: false,
  conversation_count: 12,
  news_action_type: "conversation",
} as Parameters<typeof MagicTweet>[0]["tweet"];

/**
 * Default — `MagicTweet` rendering a fixture tweet object. In production the
 * server-only `TweetCard` fetches this via react-tweet&apos;s API; in
 * Storybook we hand it a static fixture instead.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <MagicTweet tweet={FIXTURE_TWEET} />
    </Stage>
  ),
};

/** Skeleton — the loading state that ships while the fetch is in flight. */
export const Skeleton: Story = {
  render: () => (
    <Stage>
      <TweetSkeleton />
    </Stage>
  ),
};

/** Not found — the empty state shown when the API returns nothing. */
export const NotFound: Story = {
  render: () => (
    <Stage>
      <TweetNotFound />
    </Stage>
  ),
};

/** Wider — `className` adjusts the card width. */
export const Wider: Story = {
  render: () => (
    <Stage>
      <MagicTweet tweet={FIXTURE_TWEET} className="max-w-2xl" />
    </Stage>
  ),
};
