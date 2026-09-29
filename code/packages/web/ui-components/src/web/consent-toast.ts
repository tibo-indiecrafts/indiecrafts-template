/**
 * Show the consent choice-saved toast on any web surface.
 *
 * @see docs/reference/packages/web/ui-components/src/web/consent-toast.md
 */
import { toast } from "sonner";

/** The one consent/legal "choice saved" toast shape — identical on every web surface.
 *  Copy is injected (each surface resolves its own i18n). The Manage action is
 *  OPTIONAL: the cookie banner passes it (`onManage` opens that surface's
 *  cookie-preferences control); legal re-acceptance omits it — accepting policies
 *  is not a cookie choice, so a bare confirmation toast is correct. */
export function showConsentSavedToast({
  saved,
  description,
  manage,
  onManage,
}: {
  saved: string;
  description?: string;
  manage?: string;
  onManage?: () => void;
}): void {
  toast.success(saved, {
    description,
    action:
      manage && onManage ? { label: manage, onClick: onManage } : undefined,
  });
}
