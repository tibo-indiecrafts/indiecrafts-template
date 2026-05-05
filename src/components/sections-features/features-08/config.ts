import type { FeaturesBlock } from "./schema";

export const features08Key = "features-08" as const;
export const features08Namespace = "blocks.features-08" as const;

export const features08Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-08",
  customizableKey: "blocks.features-08.customizable",
  secureTitleKey: "blocks.features-08.secure.title",
  secureBodyKey: "blocks.features-08.secure.body",
  fastTitleKey: "blocks.features-08.fast.title",
  fastBodyKey: "blocks.features-08.fast.body",
  chartTitleKey: "blocks.features-08.chart.title",
  chartBodyKey: "blocks.features-08.chart.body",
  safetyTitleKey: "blocks.features-08.safety.title",
  safetyBodyKey: "blocks.features-08.safety.body",
  safetyAvatars: [
    {
      src: "https://avatars.githubusercontent.com/u/102558960?v=4",
      name: "blocks.features-08.safety.avatars.likeur",
    },
    {
      src: "https://avatars.githubusercontent.com/u/47919550?v=4",
      name: "blocks.features-08.safety.avatars.irung",
    },
    {
      src: "https://avatars.githubusercontent.com/u/31113941?v=4",
      name: "blocks.features-08.safety.avatars.ng",
    },
  ],
};
