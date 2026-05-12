import type { PortableTextBlock } from "@portabletext/types";

export type CustomerStoryAuthor = {
  name: string;
  role?: string;
  image?: string;
};

export type CustomerStoryTestimonial = {
  quote: string;
  author: CustomerStoryAuthor;
};

export type CustomerStory = {
  name: string;
  title: string;
  about: string;
  image?: string;
  website: string;
  dateJoined: string;
  dateFounded: string;
  body?: PortableTextBlock[];
  testimonial?: CustomerStoryTestimonial;
};

/**
 * Sample story used by Storybook and as the page-template default
 * so the route renders without a CMS connection. Replace with real
 * data via the `story` prop when wiring up Sanity / a database.
 */
export const customerStory05Sample: CustomerStory = {
  name: "Bolt",
  title: "How Bolt scaled streaming infrastructure to 10M concurrent viewers",
  about:
    "Bolt is a streaming-platform engineering team that powers live and on-demand video for major broadcasters. They came to Tailark to cut buffering, ship features faster, and unify their content-delivery pipeline.",
  image:
    "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?q=80&w=2340&auto=format&fit=crop",
  website: "https://bolt.example.com",
  dateJoined: "2023-04-15",
  dateFounded: "2018-09-01",
  body: [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "intro-1",
          text: "Before partnering with us, Bolt's engineering team spent months patching custom streaming logic across regions. By migrating to Tailark's optimization suite, they reduced buffering by 62% during peak viewing hours and unlocked a 30% drop in egress cost.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-results",
      style: "h2",
      children: [
        {
          _type: "span",
          _key: "h2-results-1",
          text: "The results",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "results-1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "results-1-1",
          text: "Within the first quarter, Bolt's playback team measured a 62% reduction in rebuffer events at peak hours, a 1.4s improvement in time-to-first-frame, and a 30% cut in egress spend across their CDN portfolio.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-stack",
      style: "h2",
      children: [
        {
          _type: "span",
          _key: "h2-stack-1",
          text: "How they shipped it",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "stack-1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "stack-1-1",
          text: "Bolt rolled out the optimization suite region-by-region using feature flags, observed each metric land, and only then promoted to the next region. The whole migration took six weeks, with no degradation in viewer experience.",
          marks: [],
        },
      ],
    },
  ],
  testimonial: {
    quote:
      "We tried five other vendors before Tailark. None of them came close on tail-latency under load. The team delivered exactly what they promised — and shipped it faster than we did.",
    author: {
      name: "Maya Okonkwo",
      role: "VP Engineering, Bolt",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
  },
};
