import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonsCard } from "./tailwindcss-buttons";

const meta: Meta<typeof ButtonsCard> = {
  title: "UI Effects/Buttons/TailwindcssButtons",
  component: ButtonsCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ButtonsCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
    <div className="w-[420px]">{children}</div>
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium">
          Solid pill
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

export const OutlineButton: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="border-foreground/30 text-foreground hover:bg-foreground/5 rounded-full border px-6 py-2 text-sm font-medium transition-colors">
          Ghost pill
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

export const Gradient: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg">
          Try the demo
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <div className="flex flex-col items-center gap-3">
          <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium">
            Primary
          </button>
          <button className="border-foreground/30 text-foreground rounded-full border px-6 py-2 text-sm font-medium">
            Secondary
          </button>
        </div>
      </ButtonsCard>
    </Stage>
  ),
};

export const WithClickHandler: Story = {
  render: () => (
    <Stage>
      <ButtonsCard
        onClick={() => {
          // copy-to-clipboard hook would go here
          // navigator.clipboard.writeText("...")
        }}
      >
        <button className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium">
          Click the card to log
        </button>
      </ButtonsCard>
    </Stage>
  ),
};
