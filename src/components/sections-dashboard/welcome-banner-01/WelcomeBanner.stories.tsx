import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import WelcomeBannerSection from "./WelcomeBanner";
import { welcomeBanner01Sample } from "./config";

const meta: Meta<typeof WelcomeBannerSection> = {
  title: "Sections/Dashboard/WelcomeBanner01",
  component: WelcomeBannerSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl pt-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof WelcomeBannerSection>;

/** Default — no name passed; greeting falls back to the translated placeholder. */
export const Default: Story = {
  args: { ...welcomeBanner01Sample, id: "welcome-banner-01-default" },
};

/** WithName — exercises the ICU `{name}` interpolation in the greeting. */
export const WithName: Story = {
  args: {
    ...welcomeBanner01Sample,
    id: "welcome-banner-01-with-name",
    userName: "Ada",
  },
};

/** Compact — trimmed 2-chip row, useful for empty workspaces or dense dashboards. */
export const Compact: Story = {
  args: {
    type: "welcome-banner-01",
    id: "welcome-banner-01-compact",
    userName: "Ada",
    chips: [
      { id: "launch", iconKey: "Rocket", href: "/dashboard" },
      { id: "shortcuts", iconKey: "Zap" },
    ],
  },
};
