import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EvervaultCard, Icon } from "./evervault-card";

const meta: Meta<typeof EvervaultCard> = {
  title: "UI Effects/Cards/EvervaultCard",
  component: EvervaultCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof EvervaultCard>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="border-foreground/10 relative mx-auto flex h-[28rem] w-[28rem] max-w-full flex-col items-start gap-4 rounded-3xl border p-6">
    {children}
  </div>
);

/** Default — hovering reveals a glowing reveal of random characters. */
export const Default: Story = {
  render: () => (
    <Frame>
      <Icon className="text-foreground absolute -top-3 -left-3 h-6 w-6" />
      <Icon className="text-foreground absolute -top-3 -right-3 h-6 w-6" />
      <Icon className="text-foreground absolute -bottom-3 -left-3 h-6 w-6" />
      <Icon className="text-foreground absolute -right-3 -bottom-3 h-6 w-6" />
      <EvervaultCard text="hover" />
      <h2 className="text-foreground mt-4 text-sm font-light">
        Hover over this card to reveal an awesome effect.
      </h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Encrypted vault feel — randomly generated characters animate behind a masked
        spotlight that follows your cursor.
      </p>
    </Frame>
  ),
};

/** Custom centre text — pass `text` to retune the headline letter glyph. */
export const CustomText: Story = {
  render: () => (
    <Frame>
      <Icon className="text-foreground absolute -top-3 -left-3 h-6 w-6" />
      <Icon className="text-foreground absolute -top-3 -right-3 h-6 w-6" />
      <Icon className="text-foreground absolute -bottom-3 -left-3 h-6 w-6" />
      <Icon className="text-foreground absolute -right-3 -bottom-3 h-6 w-6" />
      <EvervaultCard text="A" />
    </Frame>
  ),
};

/** Without corner icons — minimal framing, just the card. */
export const NoIcons: Story = {
  render: () => (
    <div className="h-[28rem] w-[28rem] max-w-full">
      <EvervaultCard text="✦" />
    </div>
  ),
};
