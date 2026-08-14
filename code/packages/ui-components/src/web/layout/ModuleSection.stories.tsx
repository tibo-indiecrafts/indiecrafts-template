import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModuleSection } from "./ModuleSection";
import docs from "./ModuleSection.md?raw";

// Layout helper: the shared section shell (max-width + vertical rhythm). `inline`
// drops the chrome so a module can sit bare inside a prose column.
const meta = {
  title: "UI Components/ModuleSection",
  component: ModuleSection,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: { inline: false },
  argTypes: { inline: { control: "boolean" }, children: { table: { disable: true } } },
} satisfies Meta<typeof ModuleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ModuleSection {...args}>
      <div className="bg-muted rounded-lg p-6 text-center">Section content</div>
    </ModuleSection>
  ),
};

export const Inline: Story = { ...Default, args: { inline: true } };
