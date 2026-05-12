import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AvatarCircles } from "./avatar-circles";

const meta: Meta<typeof AvatarCircles> = {
  title: "UI Effects/Social/AvatarCircles",
  component: AvatarCircles,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AvatarCircles>;

const AVATARS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    profileUrl: "#sarah",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    profileUrl: "#marcus",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    profileUrl: "#aisha",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    profileUrl: "#theo",
  },
];

const MORE_AVATARS = [
  ...AVATARS,
  {
    imageUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
    profileUrl: "#robin",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
    profileUrl: "#chen",
  },
];

export const Default: Story = {
  render: () => <AvatarCircles avatarUrls={AVATARS} numPeople={3} />,
};

export const NoOverflow: Story = {
  render: () => <AvatarCircles avatarUrls={AVATARS} />,
};

export const Single: Story = {
  render: () => <AvatarCircles avatarUrls={[AVATARS[0]]} />,
};

export const LargeTeam: Story = {
  render: () => <AvatarCircles avatarUrls={MORE_AVATARS} numPeople={12} />,
};

export const InContext: Story = {
  render: () => (
    <div className="flex max-w-md flex-col items-center gap-3 text-center">
      <AvatarCircles avatarUrls={AVATARS} numPeople={120} />
      <p className="text-muted-foreground text-sm">
        Trusted by 120+ teams shipping every day.
      </p>
    </div>
  ),
};
