import type { ReactNode } from "react";
import { AppShell } from "@/user-interface/layout/AppShell";

/** Every page in the `(app)` group renders inside the sidebar shell. `sign-in` stays outside. */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
