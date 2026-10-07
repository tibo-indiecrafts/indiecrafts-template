import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const native = vi.hoisted(() => ({ on: true, platform: "android" }));
const setStyle = vi.hoisted(() => vi.fn(async (_o: { style: string }) => {}));
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => native.on,
    getPlatform: () => native.platform,
  },
}));
vi.mock("@capacitor/app", () => ({
  App: { addListener: async () => ({ remove: () => {} }), exitApp: () => {} },
}));
vi.mock("@capacitor/browser", () => ({ Browser: { open: async () => {} } }));
vi.mock("@capacitor/splash-screen", () => ({
  SplashScreen: { hide: async () => {} },
}));
vi.mock("@capacitor/status-bar", () => ({
  StatusBar: { setStyle },
  Style: { Dark: "DARK", Light: "LIGHT", Default: "DEFAULT" },
}));

import { NativeBridge } from "./NativeBridge";

const html = document.documentElement;
let unmount = () => {};
function mount() {
  const host = document.createElement("div");
  const root = createRoot(host);
  act(() => root.render(<NativeBridge />));
  unmount = () => act(() => root.unmount());
}
const lastStyle = () => setStyle.mock.calls.at(-1)?.[0].style;

afterEach(() => {
  unmount();
  setStyle.mockClear();
  delete html.dataset.nativeShell;
  delete html.dataset.theme;
  html.style.removeProperty("--safe-area-inset-top");
  Object.assign(native, { on: true, platform: "android" });
});

// MutationObserver callbacks run as a microtask.
const flush = () => act(async () => {});

describe("NativeBridge", () => {
  it("under the bar, the status bar follows the app theme and its toggle", async () => {
    html.dataset.theme = "dark";
    mount();
    expect(lastStyle()).toBe("DEFAULT"); // insets not injected yet → padded, system window
    html.style.setProperty("--safe-area-inset-top", "24px"); // Capacitor, WebView 140+
    await flush();
    expect(lastStyle()).toBe("DARK"); // light icons on the dark app, whatever the system theme
    html.dataset.theme = "light";
    await flush();
    expect(lastStyle()).toBe("LIGHT");
  });

  it("an older Android WebView is padded below the bar → the system style", async () => {
    html.dataset.theme = "dark";
    html.style.setProperty("--safe-area-inset-top", "0px");
    mount();
    expect(lastStyle()).toBe("DEFAULT");
  });

  it("iOS always draws under the bar", () => {
    native.platform = "ios";
    html.dataset.theme = "dark";
    mount();
    expect(lastStyle()).toBe("DARK");
  });

  it("marks the page as the native shell (Clerk hides social sign-in there)", () => {
    mount();
    expect(html.dataset.nativeShell).toBe("");
  });

  it("does nothing in a browser", () => {
    native.on = false;
    mount();
    expect(setStyle).not.toHaveBeenCalled();
    expect(html.dataset.nativeShell).toBeUndefined();
  });
});
