import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoreOnTopic } from "../collection/MoreOnTopic";
import { SidebarCard } from "./SidebarCard";
import { WithSidebar } from "./WithSidebar";
import docs from "./WithSidebar.md?raw";

const cards = (
  <>
    <SidebarCard type="module.blog-related">
      <MoreOnTopic
        title="More on Engineering"
        items={[
          {
            _key: "a",
            title: "Why config-first beats convention-first",
            href: "#",
            meta: "Aug 12",
          },
          {
            _key: "b",
            title: "Shipping faster with modular monorepos",
            href: "#",
            meta: "Aug 5",
          },
        ]}
        footer={{ label: "All Engineering posts", href: "#" }}
      />
    </SidebarCard>
    <SidebarCard type="module.prose">
      <p className="text-sm">
        A second card: any block that fits a narrow column.
      </p>
    </SidebarCard>
  </>
);

const meta = {
  title: "UI Components/WithSidebar",
  component: WithSidebar,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
    layout: "fullscreen",
  },
  args: {
    label: "Related links",
    aside: cards,
    children: (
      <div className="bg-muted min-h-96 rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Page content</h1>
        <p className="text-muted-foreground mt-2">
          Below the lg breakpoint, the cards follow this content.
        </p>
      </div>
    ),
  },
  argTypes: {
    aside: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof WithSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No card: the content renders unchanged, full width. */
export const NoSidebar: Story = { args: { aside: undefined } };
