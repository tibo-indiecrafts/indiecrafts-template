import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardList } from "./CardList";
import { portableComponents } from "../portable-text-components";
import { body, img } from "../_mock";
import docs from "./CardList.md?raw";

const cards = [
  {
    _key: "c1",
    title: "Fast",
    image: img("card1"),
    content: body("Zero to MVP in a weekend."),
    cta: {
      link: { label: "Learn more", href: "/x" },
      variant: "ghost" as const,
    },
  },
  {
    _key: "c2",
    title: "Configurable",
    image: img("card2"),
    content: body("Every client, one codebase."),
  },
  {
    _key: "c3",
    title: "Documented",
    image: img("card3"),
    content: body("Docs live next to the code."),
  },
];

const meta = {
  title: "Web/UI Components/CardList",
  component: CardList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.card-list",
    columns: 3,
    cards,
    components: portableComponents,
  },
  argTypes: {
    columns: { control: { type: "range", min: 1, max: 4 } },
    components: { table: { disable: true } },
    cards: { table: { disable: true } },
  },
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {};
export const TwoColumns: Story = {
  args: { columns: 2, cards: cards.slice(0, 2) },
};
export const WithTitle: Story = {
  args: { title: "Why us", intro: "The short version." },
};
