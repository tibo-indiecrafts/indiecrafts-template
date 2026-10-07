"use client";

/**
 * Wire the Capacitor shell's native events into the app — a no-op in a browser.
 *
 * @see docs/reference/projects/web/app/src/user-interface/shell/NativeBridge.md
 */
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { deepLinkPath, isExternalUrl } from "@/lib/shell-links";

/** Inside the Capacitor shell: Android back → history (exit at the root), deep links →
 *  the matching route, cross-origin links (legal pages, external sites) → the system
 *  browser, then the status bar is set and the splash screen hidden. Marks `<html>` with
 *  `data-native-shell` (the Clerk appearance hides social sign-in there). */
export function NativeBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const root = document.documentElement;
    root.dataset.nativeShell = "";

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const href = event.target.closest("a[href]")?.getAttribute("href");
      if (!href || !isExternalUrl(href, window.location.origin)) return;
      event.preventDefault();
      void Browser.open({ url: new URL(href, window.location.href).href });
    };
    document.addEventListener("click", onClick, true);

    const back = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void App.exitApp();
    });
    const open = App.addListener("appUrlOpen", ({ url }) => {
      window.location.assign(deepLinkPath(url));
    });

    // Status-bar icons must read on whatever sits behind them. When the page draws under
    // the bar (iOS; Android WebView 140+, where Capacitor sets `--safe-area-inset-top` on
    // <html> to the bar height) that is the APP theme (`data-theme`, the toggle). An older
    // Android WebView is padded below the bar, so the system-themed window shows → Default.
    const syncStatusBar = () => {
      const underBar =
        Capacitor.getPlatform() === "ios" ||
        parseFloat(root.style.getPropertyValue("--safe-area-inset-top")) > 0;
      const dark = root.dataset.theme === "dark";
      void StatusBar.setStyle({
        style: !underBar ? Style.Default : dark ? Style.Dark : Style.Light,
      });
    };
    syncStatusBar();
    // `style`: Capacitor injects the inset variables after the page loads.
    const themeWatch = new MutationObserver(syncStatusBar);
    themeWatch.observe(root, { attributeFilter: ["data-theme", "style"] });
    void SplashScreen.hide();

    return () => {
      themeWatch.disconnect();
      document.removeEventListener("click", onClick, true);
      void back.then((h) => h.remove());
      void open.then((h) => h.remove());
    };
  }, []);

  return null;
}
