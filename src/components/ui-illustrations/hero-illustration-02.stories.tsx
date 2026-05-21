import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeroIllustration } from "./hero-illustration-02";

const meta: Meta<typeof HeroIllustration> = {
  title: "UI Illustrations/Libre Landing Hero",
  component: HeroIllustration,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeroIllustration>;

export const Default: Story = {
  render: () => (
    <>
      <style>{`.max-lg\\:hidden { display: block !important; }`}</style>
      <div className="mx-auto w-full max-w-7xl p-8">
        <HeroIllustration />
      </div>
    </>
  ),
};
