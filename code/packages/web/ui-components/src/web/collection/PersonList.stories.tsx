import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PersonList } from "./PersonList";
import { img } from "../_mock";
import docs from "./PersonList.md?raw";

const meta = {
  title: "UI Components/PersonList",
  component: PersonList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.person-list",
    title: "The team",
    people: [
      {
        _id: "p1",
        name: "Ada Lovelace",
        role: "Engineer",
        bio: "Writes the first programs.",
        image: img("ada"),
        social: [
          { type: "external", label: "Website", href: "https://example.com" },
        ],
      },
      {
        _id: "p2",
        name: "Grace Hopper",
        role: "Compiler pioneer",
        bio: "Finds the first bug.",
        image: img("grace"),
      },
      {
        _id: "p3",
        name: "Alan Turing",
        role: "Mathematician",
        bio: "Breaks the code.",
        image: img("alan"),
      },
    ],
  },
  argTypes: {
    people: { table: { disable: true } },
    inline: { control: "boolean" },
  },
} satisfies Meta<typeof PersonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
