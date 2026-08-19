import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GalleryCarousel } from "./GalleryCarousel";
import { galleryImages } from "../_mock";
import docs from "./GalleryCarousel.md?raw";

// Client component; reads gallery labels via the Storybook next-intl mock.
const meta = {
  title: "UI Components/GalleryCarousel",
  component: GalleryCarousel,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: { images: galleryImages, ratio: "3:2" },
  argTypes: { images: { table: { disable: true } } },
} satisfies Meta<typeof GalleryCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
