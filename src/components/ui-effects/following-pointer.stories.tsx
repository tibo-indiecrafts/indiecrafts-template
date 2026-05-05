import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FollowerPointerCard } from "./following-pointer";

const meta: Meta<typeof FollowerPointerCard> = {
  title: "UI Effects/Hover & Interactions/FollowingPointer",
  component: FollowerPointerCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FollowerPointerCard>;

/**
 * Default — wrap any element to replace the system cursor with a custom
 * pointer + label. The label shows `title` (or `William Shakespeare` if you
 * pass nothing).
 */
export const Default: Story = {
  render: () => (
    <FollowerPointerCard
      title="Reading list"
      className="border-border bg-card text-foreground w-[420px] rounded-2xl border p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold">A Midsummer Night&apos;s Dream</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Hover anywhere inside this card and the OS cursor disappears in favour of the
        custom follower pointer with the title above.
      </p>
    </FollowerPointerCard>
  ),
};

/** Custom title — a JSX `title` lets you compose icons + styling. */
export const CustomTitle: Story = {
  render: () => (
    <FollowerPointerCard
      title={
        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
          Click to read
        </span>
      }
      className="border-border bg-card w-[420px] rounded-2xl border p-6"
    >
      <h3 className="text-foreground text-xl font-semibold">Behind the scenes</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        The <code>title</code> prop accepts any ReactNode — pass a styled badge for
        editorial cards, hover-to-purchase product tiles, etc.
      </p>
    </FollowerPointerCard>
  ),
};

/** Image cover — typical magazine-style use over a photographic header. */
export const ImageCover: Story = {
  render: () => (
    <FollowerPointerCard
      title="Lisbon, 2024"
      className="w-[480px] overflow-hidden rounded-2xl"
    >
      <div
        className="aspect-[16/10] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80)",
        }}
      />
      <div className="bg-card border-border border-x border-b px-5 py-4">
        <h3 className="text-foreground text-lg font-semibold">Walking the alfama</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          A short essay about the steepest streets in Europe.
        </p>
      </div>
    </FollowerPointerCard>
  ),
};

/** Grid — stacks two pointer cards side by side; each tracks independently. */
export const Grid: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid grid-cols-1 gap-6 p-10 md:grid-cols-2">
      {[
        { title: "Hamlet", body: "A prince, a ghost, a soliloquy or two." },
        { title: "Macbeth", body: "Ambition, witches, blood on the hands." },
      ].map((p) => (
        <FollowerPointerCard
          key={p.title}
          title={p.title}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <h3 className="text-foreground text-lg font-semibold">{p.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm">{p.body}</p>
        </FollowerPointerCard>
      ))}
    </div>
  ),
};
