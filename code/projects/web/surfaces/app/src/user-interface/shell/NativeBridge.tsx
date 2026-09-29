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
 *  browser, then the status bar is set and the splash screen hidden. */
export function NativeBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

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

    void StatusBar.setStyle({ style: Style.Default });
    void SplashScreen.hide();

    return () => {
      document.removeEventListener("click", onClick, true);
      void back.then((h) => h.remove());
      void open.then((h) => h.remove());
    };
  }, []);

  return null;
}
