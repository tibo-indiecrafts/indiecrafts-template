import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DefaultLayout } from "./index";

const meta: Meta<typeof DefaultLayout> = {
  title: "Layouts/Default",
  component: DefaultLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DefaultLayout>;

/** Two stacked sections — each section owns its own padding + max-width. */
export const Default: Story = {
  render: () => (
    <DefaultLayout>
      <section className="bg-muted/40 px-(--gutter) py-16">
        <div className="mx-auto max-w-(--max-container)">
          <h2 className="text-3xl font-semibold">Section A</h2>
          <p className="text-muted-foreground mt-2">
            Sections control their own padding + max-width.
          </p>
        </div>
      </section>
      <section className="px-(--gutter) py-16">
        <div className="mx-auto max-w-(--max-container)">
          <h2 className="text-3xl font-semibold">Section B</h2>
          <p className="text-muted-foreground mt-2">
            DefaultLayout is a passthrough — no chrome added.
          </p>
        </div>
      </section>
    </DefaultLayout>
  ),
};

/** Single-section page — proves the passthrough works for short pages. */
export const SingleSection: Story = {
  render: () => (
    <DefaultLayout>
      <section className="px-(--gutter) py-16">
        <div className="mx-auto max-w-(--max-container)">
          <h2 className="text-3xl font-semibold">Just one section</h2>
          <p className="text-muted-foreground mt-2">
            DefaultLayout adds no wrapper of its own — children render verbatim.
          </p>
        </div>
      </section>
    </DefaultLayout>
  ),
};
