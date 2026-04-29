import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import { PinContainer } from "./3d-pin";
import { threeDPinNamespace } from "./3d-pin.config";

const meta: Meta<typeof PinContainer> = {
  title: "UI Effects/3dPin",
  component: PinContainer,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PinContainer>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[40rem] w-full items-center justify-center">{children}</div>
);

/**
 * Default — pin with title + linked card body. Hover to lift the card and
 * reveal the perspective stem and ripple rings.
 */
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const t = useTranslations(threeDPinNamespace);
      return (
        <Frame>
          <PinContainer title={t("demoTitle")} href="https://aceternity.com">
            <div className="flex h-[20rem] w-[20rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2">
              <h3 className="!m-0 max-w-xs !pb-2 text-base font-bold text-slate-100">
                {t("demoHeading")}
              </h3>
              <div className="!m-0 !p-0 text-base font-normal">
                <span className="text-slate-500">{t("demoBody")}</span>
              </div>
              <div className="mt-4 flex flex-1 w-full rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
            </div>
          </PinContainer>
        </Frame>
      );
    };
    return <Demo />;
  },
};

/** Custom title — exercises the `title` prop directly without translations. */
export const CustomTitle: Story = {
  render: () => (
    <Frame>
      <PinContainer title="github.com/example" href="https://github.com">
        <div className="flex h-[20rem] w-[20rem] basis-full flex-col p-4 tracking-tight text-slate-100/50">
          <h3 className="!m-0 !pb-2 text-base font-bold text-slate-100">
            example/template
          </h3>
          <p className="!m-0 !p-0 text-sm text-slate-500">
            A starter repo with everything pre-wired.
          </p>
          <div className="mt-4 flex flex-1 w-full rounded-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500" />
        </div>
      </PinContainer>
    </Frame>
  ),
};

/**
 * No title — `title` and `href` omitted. The pin renders without the
 * floating label badge but the card still tilts on hover.
 */
export const NoTitle: Story = {
  render: () => (
    <Frame>
      <PinContainer>
        <div className="flex h-[18rem] w-[18rem] basis-full flex-col p-4 tracking-tight text-slate-100/50">
          <h3 className="!m-0 !pb-2 text-base font-bold text-slate-100">Untitled</h3>
          <p className="!m-0 !p-0 text-sm text-slate-500">
            A pin without a label is useful for media-only previews.
          </p>
          <div className="mt-4 flex flex-1 w-full rounded-lg bg-gradient-to-br from-amber-500 to-rose-500" />
        </div>
      </PinContainer>
    </Frame>
  ),
};
