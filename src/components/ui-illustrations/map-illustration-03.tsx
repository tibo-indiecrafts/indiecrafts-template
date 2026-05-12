import { Map } from "@/components/ui-illustrations/dotted-map-03";

const BERNARD_AVATAR = "https://avatars.githubusercontent.com/u/31113941?v=4";
const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";

export const MapIllustration = () => (
  <>
    <div aria-hidden className="absolute inset-6">
      <div className="absolute top-8 left-18 z-10 size-6 -translate-x-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
        <img
          className="aspect-square rounded-full object-cover"
          src={GLODIE_AVATAR}
          alt="Glodie"
          height="460"
          width="460"
        />
      </div>
      <div className="absolute top-1/2 right-1/2 z-10 size-6 translate-x-full -translate-y-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
        <img
          className="aspect-square rounded-full object-cover"
          src={THEO_AVATAR}
          alt="Theo"
          height="460"
          width="460"
        />
      </div>
      <div className="absolute top-1/3 right-1/4 z-10 size-6 translate-x-full -translate-y-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
        <img
          className="aspect-square rounded-full object-cover"
          src={BERNARD_AVATAR}
          alt="Bernard"
          height="460"
          width="460"
        />
      </div>
    </div>
    <div aria-hidden className="isolate scale-125">
      <Map />
    </div>
  </>
);
