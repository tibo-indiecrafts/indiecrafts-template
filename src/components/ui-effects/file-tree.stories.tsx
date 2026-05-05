import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { File, Folder, Tree, type TreeViewElement } from "./file-tree";

const meta: Meta<typeof Tree> = {
  title: "UI Effects/Data display/FileTree",
  component: Tree,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Tree>;

const REPO_ELEMENTS: TreeViewElement[] = [
  {
    id: "root",
    name: "indiecrafts-template",
    children: [
      {
        id: "src",
        name: "src",
        children: [
          {
            id: "app",
            name: "app",
            children: [
              { id: "layout", name: "layout.tsx" },
              { id: "page", name: "page.tsx" },
            ],
          },
          {
            id: "components",
            name: "components",
            children: [
              { id: "button", name: "Button.tsx" },
              { id: "card", name: "Card.tsx" },
            ],
          },
          { id: "globals", name: "globals.css" },
        ],
      },
      { id: "package", name: "package.json" },
      { id: "tsconfig", name: "tsconfig.json" },
      { id: "readme", name: "README.md" },
    ],
  },
];

/** Composed via JSX — typical static directory layout. */
export const Default: Story = {
  render: () => (
    <Tree
      className="bg-background h-72 w-72 rounded-md border p-2"
      initialExpandedItems={["1", "3", "6"]}
    >
      <Folder element="src" value="1">
        <File value="2">
          <span>index.ts</span>
        </File>
        <Folder element="components" value="3">
          <File value="4">
            <span>Button.tsx</span>
          </File>
          <File value="5">
            <span>Card.tsx</span>
          </File>
          <Folder element="ui" value="6">
            <File value="7">
              <span>accordion.tsx</span>
            </File>
            <File value="8">
              <span>tooltip.tsx</span>
            </File>
          </Folder>
        </Folder>
        <Folder element="lib" value="9">
          <File value="10">
            <span>utils.ts</span>
          </File>
        </Folder>
      </Folder>
      <File value="11">
        <span>package.json</span>
      </File>
      <File value="12">
        <span>tsconfig.json</span>
      </File>
    </Tree>
  ),
};

/** Driven by a `TreeViewElement[]` — declarative form, easier to load from data. */
export const FromElements: Story = {
  render: () => (
    <Tree
      className="bg-background h-80 w-80 rounded-md border p-2"
      initialExpandedItems={["root", "src", "components"]}
      elements={REPO_ELEMENTS}
    />
  ),
};

/** Pre-selected — `initialSelectedId` highlights a file on mount. */
export const PreSelected: Story = {
  render: () => (
    <Tree
      className="bg-background h-80 w-80 rounded-md border p-2"
      initialExpandedItems={["root", "src", "components"]}
      initialSelectedId="card"
      elements={REPO_ELEMENTS}
    />
  ),
};

/** Fully collapsed — root only; user expands manually. */
export const Collapsed: Story = {
  render: () => (
    <Tree
      className="bg-background h-80 w-80 rounded-md border p-2"
      elements={REPO_ELEMENTS}
    />
  ),
};

/** RTL — passes `dir="rtl"` so chevrons and indentation flip. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Tree
        dir="rtl"
        className="bg-background h-80 w-80 rounded-md border p-2"
        initialExpandedItems={["root", "src"]}
        elements={REPO_ELEMENTS}
      />
    </div>
  ),
};
