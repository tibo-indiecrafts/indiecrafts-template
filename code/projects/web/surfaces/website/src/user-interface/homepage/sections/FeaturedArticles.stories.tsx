import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";
import en from "../../../../messages/en.json";
import { FeaturedArticles } from "./FeaturedArticles";

const labels = en.pages.home.blocks.featured;

// No images: `FeaturedMedia` then draws its placeholder, so the story needs no network.
const POSTS: PostListItem[] = [
  {
    _id: "post-1",
    title: "Ship a client site in a weekend",
    slug: "ship-a-client-site-in-a-weekend",
    publishedAt: "2026-06-01T09:00:00Z",
    categories: [{ _id: "cat-1", title: "Guides", slug: "guides" }],
    authors: [
      { _id: "author-1", name: "Ada Martin" },
      { _id: "author-2", name: "Léa Dubois" },
    ],
    metadata: { description: "A config-first setup cuts the first deploy to a day." },
  },
  {
    _id: "post-2",
    title: "Why the blog became a module",
    slug: "why-the-blog-became-a-module",
    publishedAt: "2026-05-20T09:00:00Z",
    authors: [{ _id: "author-1", name: "Ada Martin" }],
  },
  {
    _id: "post-3",
    title: "Locale routing without surprises",
    slug: "locale-routing-without-surprises",
    publishedAt: "2026-05-10T09:00:00Z",
    authors: [{ _id: "author-2", name: "Léa Dubois" }],
  },
];

/**
 * Homepage "editor's desk": one lead pick beside a compact list of up to three runners-up.
 * Pure display — the home page fetches the featured posts and resolves the labels.
 */
const meta = {
  title: "Homepage/FeaturedArticles",
  component: FeaturedArticles,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    id: "home-featured",
    posts: POSTS,
    locale: "en",
    eyebrow: labels.eyebrow,
    title: labels.title,
    body: labels.body,
    viewAllLabel: labels.viewAll,
  },
} satisfies Meta<typeof FeaturedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A lead pick plus runners-up. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: labels.title })).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Ship a client site in a weekend" }),
    ).toHaveAttribute("href", "/blog/ship-a-client-site-in-a-weekend");
    await expect(canvas.getByText(/Ada Martin \+1/)).toBeVisible();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
  },
};

/** One post → no runners-up list; the lead spans the full width. */
export const SinglePost: Story = {
  args: { posts: POSTS.slice(0, 1) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("list")).toBeNull();
  },
};

/** No posts → nothing (the home page also gates the section on a featured post). */
export const Empty: Story = {
  args: { posts: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("region")).toBeNull();
  },
};
