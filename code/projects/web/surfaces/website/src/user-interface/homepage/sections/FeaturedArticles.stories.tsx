import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FeaturedArticles } from "./FeaturedArticles";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Homepage "editor's desk" — a lead pick + a compact list of runners-up. Pure
 * display: the home page fetches the posts and passes them in. Exercises the
 * next-intl mock (`pages.blog.playVideo`, via `FeaturedMedia`) and `@/i18n/routing`'s
 * mocked `Link`.
 */
const POSTS: PostListItem[] = [
  {
    _id: "post-1",
    title: "Ship a client site in a weekend",
    slug: "ship-a-client-site-in-a-weekend",
    publishedAt: "2026-06-01T00:00:00Z",
    categories: [{ _id: "cat-1", title: "Guides", slug: "guides" }],
    authors: [{ _id: "author-1", name: "Alex Rivera" }],
    metadata: { description: "A config-first template cuts the setup to a day." },
  },
  {
    _id: "post-2",
    title: "Why we split the blog into a module",
    slug: "why-we-split-the-blog-into-a-module",
    publishedAt: "2026-05-20T00:00:00Z",
    authors: [{ _id: "author-1", name: "Alex Rivera" }],
  },
  {
    _id: "post-3",
    title: "Locale routing without the footguns",
    slug: "locale-routing-without-the-footguns",
    publishedAt: "2026-05-10T00:00:00Z",
    authors: [{ _id: "author-2", name: "Jamie Chen" }],
  },
];

const meta = {
  title: "Website/Homepage/FeaturedArticles",
  component: FeaturedArticles,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    id: "home-featured",
    posts: POSTS,
    locale: "en",
    eyebrow: "Featured",
    title: "Notes from the studio",
    body: "Guides, teardowns, and field notes on shipping client sites faster.",
    viewAllLabel: "All articles",
  },
} satisfies Meta<typeof FeaturedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A lead pick + a list of runners-up. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Ship a client site in a weekend")).toBeVisible();
    await expect(canvas.getByText("Why we split the blog into a module")).toBeVisible();
    await expect(canvas.getByText("All articles")).toBeVisible();
  },
};

/** A single post → no runners-up list, the lead card spans the full width. */
export const SinglePost: Story = {
  args: { posts: [POSTS[0]] },
};

/** No posts → renders nothing (the home page gates this section on `posts.length`). */
export const Empty: Story = {
  args: { posts: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild).toBeEmptyDOMElement();
  },
};
