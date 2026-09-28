import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthorBio } from "./AuthorBio";
import docs from "./AuthorBio.md?raw";

const meta = {
  title: "Web/UI Components/AuthorBio",
  component: AuthorBio,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    label: "Written by",
    authors: [
      {
        _key: "a",
        name: "Ada Lovelace",
        role: "Founder · Analytic Studio",
        bio: "Mathematician, writer, and self-described 'enchantress of numbers'.",
        href: "/author/ada-lovelace",
      },
    ],
  },
  argTypes: { authors: { table: { disable: true } } },
} satisfies Meta<typeof AuthorBio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoAuthors: Story = {
  args: {
    authors: [
      {
        _key: "a",
        name: "Ada Lovelace",
        role: "Founder · Analytic Studio",
        bio: "Mathematician, writer, and self-described 'enchantress of numbers'.",
        href: "/author/ada-lovelace",
      },
      {
        _key: "b",
        name: "Grace Hopper",
        role: "Engineering · USNR",
        bio: "Compiler pioneer. If it works, ship it; ask forgiveness, not permission.",
        href: "/author/grace-hopper",
      },
    ],
  },
};
