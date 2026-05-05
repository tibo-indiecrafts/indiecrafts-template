import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Source, SourceContent, SourceTrigger } from "./sources";

const meta: Meta = {
  title: "UI Molecules/AI/Sources",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Source href="https://tailark.com">
        <SourceTrigger showFavicon />
        <SourceContent
          title="Tailark"
          description="A collection of pre-built, responsive UI blocks and components for marketing websites."
        />
      </Source>
      <Source href="https://www.google.com">
        <SourceTrigger showFavicon />
        <SourceContent title="Google" description="Search the world's information." />
      </Source>
    </div>
  ),
};
