import { toast } from "sonner";

/** The one consent/legal "choice saved" toast shape — identical on every web surface.
 *  Copy is injected (each surface resolves its own i18n); `onManage` opens that
 *  surface's cookie-preferences control. */
export function showConsentSavedToast({
  saved,
  description,
  manage,
  onManage,
}: {
  saved: string;
  description: string;
  manage: string;
  onManage: () => void;
}): void {
  toast.success(saved, { description, action: { label: manage, onClick: onManage } });
}
