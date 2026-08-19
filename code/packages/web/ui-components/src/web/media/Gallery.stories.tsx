import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Gallery } from "./Gallery";
import { galleryImages } from "../_mock";
import docs from "./Gallery.md?raw";

const meta = {
  title: "UI Components/Gallery",
  component: Gallery,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.gallery",
    title: "Gallery",
    intro: "A responsive image grid that opens a lightbox carousel.",
    ratio: "3:2",
    images: galleryImages,
  },
  argTypes: {
    ratio: { control: "select", options: ["3:2", "4:3", "16:9", "1:1", "4:5"] },
    images: { table: { disable: true } },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
