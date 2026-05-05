import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LightDarkParticles } from "./light-dark-particles";

const meta: Meta<typeof LightDarkParticles> = {
  title: "UI Effects/Particles & Effects/LightDarkParticles",
  component: LightDarkParticles,
  parameters: { layout: "fullscreen" },
  args: { id: "story-light-dark-particles" },
  decorators: [
    (Story) => (
      <div className="bg-background relative h-screen w-screen">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LightDarkParticles>;

export const Default: Story = {};
