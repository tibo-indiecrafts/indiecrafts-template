import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImagesBadge } from "./images-badge";

const meta: Meta<typeof ImagesBadge> = {
  title: "UI Effects/ImagesBadge",
  component: ImagesBadge,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ImagesBadge>;

const IMAGES = [
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80",
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

/**
 * Default — folder icon with three images peeking out of it. Hover the badge
 * to fan the images upward and reveal them at full size.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <ImagesBadge text="View gallery" images={IMAGES} />
    </Stage>
  ),
};

/** As link — pass `href` and the component renders as `<a>`. */
export const AsLink: Story = {
  render: () => (
    <Stage>
      <ImagesBadge
        text="See 12 photos"
        images={IMAGES}
        href="#gallery"
      />
    </Stage>
  ),
};

/** Single image — fans straight up with no spread or rotation. */
export const SingleImage: Story = {
  render: () => (
    <Stage>
      <ImagesBadge text="View attachment" images={[IMAGES[0]]} />
    </Stage>
  ),
};

/**
 * Large folder — `folderSize`, `teaserImageSize`, `hoverImageSize` scale the
 * whole composition up; bumped `hoverTranslateY` and `hoverSpread` so the
 * fan still clears the badge cleanly.
 */
export const LargeFolder: Story = {
  render: () => (
    <Stage>
      <ImagesBadge
        text="Recent uploads"
        images={IMAGES}
        folderSize={{ width: 56, height: 42 }}
        teaserImageSize={{ width: 36, height: 24 }}
        hoverImageSize={{ width: 84, height: 56 }}
        hoverTranslateY={-60}
        hoverSpread={36}
      />
    </Stage>
  ),
};

/** Wider fan — `hoverSpread={40}` and `hoverRotation={30}` for a dramatic spread. */
export const WideFan: Story = {
  render: () => (
    <Stage>
      <ImagesBadge
        text="Spread me wide"
        images={IMAGES}
        hoverSpread={40}
        hoverRotation={30}
        hoverTranslateY={-50}
      />
    </Stage>
  ),
};
