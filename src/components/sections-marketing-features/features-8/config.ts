import type { Features8Block } from "./schema";

export const features8Sample: Omit<Features8Block, "id"> = {
  type: "features-8",
  customizableKey: "blocks.features-8.customizable",
  secureTitleKey: "blocks.features-8.secure.title",
  secureBodyKey: "blocks.features-8.secure.body",
  fastTitleKey: "blocks.features-8.fast.title",
  fastBodyKey: "blocks.features-8.fast.body",
  chartTitleKey: "blocks.features-8.chart.title",
  chartBodyKey: "blocks.features-8.chart.body",
  safetyTitleKey: "blocks.features-8.safety.title",
  safetyBodyKey: "blocks.features-8.safety.body",
  safetyAvatars: [
    {
      src: "https://avatars.githubusercontent.com/u/102558960?v=4",
      name: "blocks.features-8.safety.avatars.likeur",
    },
    {
      src: "https://avatars.githubusercontent.com/u/47919550?v=4",
      name: "blocks.features-8.safety.avatars.irung",
    },
    {
      src: "https://avatars.githubusercontent.com/u/31113941?v=4",
      name: "blocks.features-8.safety.avatars.ng",
    },
  ],
};
