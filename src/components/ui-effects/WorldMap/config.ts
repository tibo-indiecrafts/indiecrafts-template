export const worldMapKey = "world-map" as const;
export const worldMapNamespace = "blocks.world-map" as const;

/**
 * Default routes — three intercontinental arcs. Lat/lng pairs aren't
 * translatable; the wrapper combines these with a translated `alt` text
 * for the rasterized SVG fallback. Override the prop to wire real data.
 */
export const worldMapDefaultDots = [
  {
    start: { lat: 40.7128, lng: -74.006, label: "NYC" },
    end: { lat: 51.5074, lng: -0.1278, label: "LDN" },
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: "LDN" },
    end: { lat: 35.6762, lng: 139.6503, label: "TYO" },
  },
  {
    start: { lat: -33.8688, lng: 151.2093, label: "SYD" },
    end: { lat: 1.3521, lng: 103.8198, label: "SGP" },
  },
] as const;
