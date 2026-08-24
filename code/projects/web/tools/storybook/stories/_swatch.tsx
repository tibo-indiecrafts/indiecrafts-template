/**
 * Token doc helpers. Chips paint with `background: var(--token)` (not a
 * computed hex), so they update live when the `data-theme` toolbar flips.
 * Inline styles keep them self-contained inside MDX (no purge risk).
 */
export function Swatch({ token, name }: { token: string; name?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
      <div
        style={{
          background: `var(${token})`,
          width: 44,
          height: 44,
          borderRadius: 10,
          flexShrink: 0,
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}
      />
      <div style={{ minWidth: 0 }}>
        <code style={{ fontSize: 13 }}>{token}</code>
        {name ? <div style={{ fontSize: 12, opacity: 0.7 }}>{name}</div> : null}
      </div>
    </div>
  );
}

/**
 * A literal-hex chip — for the native token page, where React Native ships resolved
 * hex (no live CSS var). Shows the token name + its hex for the chosen theme.
 */
export function HexSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
      <div
        style={{
          background: hex,
          width: 44,
          height: 44,
          borderRadius: 10,
          flexShrink: 0,
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}
      />
      <div style={{ minWidth: 0 }}>
        <code style={{ fontSize: 13 }}>{name}</code>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{hex}</div>
      </div>
    </div>
  );
}

/** Render a named subset of a native theme's hex color map as a swatch grid. */
export function NativePalette({
  colors,
  names,
}: {
  colors: Record<string, string>;
  names: readonly string[];
}) {
  return (
    <SwatchGrid>
      {names.map((n) => (
        <HexSwatch key={n} hex={colors[n]} name={n} />
      ))}
    </SwatchGrid>
  );
}

export function SwatchGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem",
        margin: "1.25rem 0",
      }}
    >
      {children}
    </div>
  );
}
