import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarLayout } from "./index";

const meta: Meta<typeof SidebarLayout> = {
  title: "Layouts/Sidebar",
  component: SidebarLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SidebarLayout>;

const sampleAside = (
  <nav aria-label="On this page" className="text-sm">
    <p className="text-muted-foreground mb-3 font-medium">On this page</p>
    <ul className="space-y-2">
      <li>
        <a className="hover:text-foreground" href="#section-a">
          Section A
        </a>
      </li>
      <li>
        <a className="hover:text-foreground" href="#section-b">
          Section B
        </a>
      </li>
      <li>
        <a className="hover:text-foreground" href="#section-c">
          Section C
        </a>
      </li>
    </ul>
  </nav>
);

export const Default: Story = {
  render: () => (
    <SidebarLayout aside={sampleAside}>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Documentation page</h1>
        <p>
          The sidebar layout puts a sticky aside on the left at lg+ and stacks on smaller
          breakpoints. Pass <code>aside</code> via the page config to fill the rail with a
          TOC, a mini-nav, or anything else.
        </p>
        <h2 id="section-a">Section A</h2>
        <p>
          Body content lives in the right column. The sidebar tracks scroll because the{" "}
          <code>aside</code> uses <code>lg:sticky lg:top-24</code>.
        </p>
        <h2 id="section-b">Section B</h2>
        <p>More content to make the page tall enough to demonstrate stickiness.</p>
        <h2 id="section-c">Section C</h2>
        <p>End of the demo content.</p>
      </article>
    </SidebarLayout>
  ),
};

/** No `aside` — layout collapses to a single column. */
export const WithoutAside: Story = {
  render: () => (
    <SidebarLayout>
      <p className="text-muted-foreground">
        When <code>aside</code> is not provided, the layout collapses to a single column.
      </p>
    </SidebarLayout>
  ),
};

/**
 * Long body content — demonstrates the sticky aside behaviour: the TOC stays
 * pinned to the top of its column while the body scrolls past on `lg+`.
 */
export const LongContent: Story = {
  render: () => (
    <SidebarLayout aside={sampleAside}>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Long-form documentation</h1>
        {Array.from({ length: 8 }).map((_, i) => (
          <section key={i}>
            <h2 id={`section-${i + 1}`}>Section {i + 1}</h2>
            <p>
              This long-form story exists to demonstrate the sticky aside behaviour. As
              you scroll through paragraphs in the body, the on-this-page nav stays
              pinned to the top of its column.
            </p>
            <p>
              Pinning the aside requires the surrounding viewport to actually scroll, so
              we render eight padded sections in sequence.
            </p>
          </section>
        ))}
      </article>
    </SidebarLayout>
  ),
};
