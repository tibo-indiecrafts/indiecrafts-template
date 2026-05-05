import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProseLayout } from "./index";

const meta: Meta<typeof ProseLayout> = {
  title: "Layouts/Prose",
  component: ProseLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProseLayout>;

/** Privacy-policy-style content — verifies typography spacing and lists. */
export const Default: Story = {
  render: () => (
    <ProseLayout>
      <h1>Privacy policy</h1>
      <p>
        Effective date: <em>January 1, 2026</em>. This is a sample document showing how
        the prose layout applies typography spacing to long-form content.
      </p>
      <h2>What we collect</h2>
      <p>
        We collect only the data you explicitly provide. No tracking pixels, no
        third-party analytics by default. Your IP address is logged for 14 days for
        rate-limiting purposes.
      </p>
      <ul>
        <li>Email address (when you contact us)</li>
        <li>Form submissions</li>
        <li>Aggregated, anonymous usage metrics</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        Solely to respond to your messages and improve the service. We do not sell or
        share data with third parties. See <a href="#terms">our terms</a> for the full
        legal version.
      </p>
    </ProseLayout>
  ),
};

/**
 * Blog-post-style content — exercises code blocks, blockquotes, and inline
 * formatting that the privacy story doesn't cover.
 */
export const BlogPost: Story = {
  render: () => (
    <ProseLayout>
      <h1>Why we ship templates, not boilerplates</h1>
      <p>
        A boilerplate is a starting point you outgrow. A template is a starting point you
        keep using.
      </p>
      <blockquote>
        <p>
          &ldquo;Forks should differ in <em>config</em>, not in <em>code</em>.&rdquo;
        </p>
      </blockquote>
      <h2>The single-source-of-truth principle</h2>
      <p>
        Every client website is a fork of this template. Only <code>src/config/*</code>{" "}
        and <code>messages/*</code> change. The component tree stays identical.
      </p>
      <pre>
        <code>{`pnpm new:page contact
pnpm verify`}</code>
      </pre>
      <p>
        This is the entire workflow for adding a page: scaffold, then verify. No component
        edits required.
      </p>
    </ProseLayout>
  ),
};

/**
 * Single short paragraph — proves the layout looks balanced even with sparse
 * content (no awkward leading whitespace at the top).
 */
export const ShortSnippet: Story = {
  render: () => (
    <ProseLayout>
      <h1>404 — Page not found</h1>
      <p>
        The page you were looking for has moved or never existed. Head back to the{" "}
        <a href="#home">home page</a> or use the search bar above.
      </p>
    </ProseLayout>
  ),
};
