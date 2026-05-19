import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CLIP_PATH_MASKING_PATTERNS, ClipPathMasking } from "./index";

const SHOWCASE_SOURCES = [
  "https://images.unsplash.com/photo-1498019559366-a1cbd07b5160?q=80&w=2058&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718603630685-d2605d5190e8?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718795903419-2bc5bba08d2f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718524767487-7f98d4e5eeeb?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718633739487-6efee8ac466d?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1718601980986-0ce75101d52d?w=500&auto=format&fit=crop",
];

const meta: Meta<typeof ClipPathMasking> = {
  title: "UI Effects/Masking/ClipPathMasking",
  component: ClipPathMasking,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ClipPathMasking>;

export const Default: Story = {
  args: {
    pattern: 1,
    src: SHOWCASE_SOURCES[0],
  },
  render: (args) => (
    <div className="w-[min(60vw,320px)]">
      <ClipPathMasking {...args} />
    </div>
  ),
};

export const Showcase: Story = {
  render: () => (
    <section className="bg-background grid w-[min(90vw,960px)] grid-cols-3 gap-8 rounded-lg border p-5">
      {CLIP_PATH_MASKING_PATTERNS.map((pattern, idx) => (
        <ClipPathMasking
          key={pattern}
          pattern={pattern}
          src={SHOWCASE_SOURCES[idx % SHOWCASE_SOURCES.length]}
        />
      ))}
    </section>
  ),
};
