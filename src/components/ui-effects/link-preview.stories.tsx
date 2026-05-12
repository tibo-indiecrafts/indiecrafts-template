import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkPreview } from "./link-preview";

const meta: Meta<typeof LinkPreview> = {
  title: "UI Effects/Hover & Interactions/LinkPreview",
  component: LinkPreview,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LinkPreview>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[320px] w-full items-center justify-center p-10">
    <p className="text-foreground max-w-2xl text-center text-base leading-relaxed md:text-lg">
      {children}
    </p>
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      Built on top of{" "}
      <LinkPreview url="https://nextjs.org" className="font-medium underline">
        Next.js
      </LinkPreview>
      , the React framework for the web.
    </Stage>
  ),
};

export const Static: Story = {
  render: () => (
    <Stage>
      Designed by{" "}
      <LinkPreview
        url="#stripes"
        isStatic
        imageSrc="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
        className="font-medium underline"
      >
        Stripes Studio
      </LinkPreview>{" "}
      with custom illustration.
    </Stage>
  ),
};

export const LargePreview: Story = {
  render: () => (
    <Stage>
      Inspired by{" "}
      <LinkPreview
        url="#mountain"
        isStatic
        imageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
        width={320}
        height={200}
        className="font-medium underline"
      >
        the wilderness
      </LinkPreview>{" "}
      that surrounds our studio.
    </Stage>
  ),
};

export const MultipleLinks: Story = {
  render: () => (
    <Stage>
      Read about{" "}
      <LinkPreview
        url="#one"
        isStatic
        imageSrc="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
        className="font-medium underline"
      >
        Bordeaux
      </LinkPreview>
      ,{" "}
      <LinkPreview
        url="#two"
        isStatic
        imageSrc="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
        className="font-medium underline"
      >
        Berlin
      </LinkPreview>
      , and{" "}
      <LinkPreview
        url="#three"
        isStatic
        imageSrc="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
        className="font-medium underline"
      >
        Kyoto
      </LinkPreview>{" "}
      in our latest essay series.
    </Stage>
  ),
};
