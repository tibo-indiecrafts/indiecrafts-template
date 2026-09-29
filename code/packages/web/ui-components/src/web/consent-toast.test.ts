import { describe, it, expect, vi } from "vitest";

vi.mock("sonner", () => {
  return {
    toast: {
      success: vi.fn(),
    },
  };
});

import { showConsentSavedToast } from "./consent-toast";
import { toast } from "sonner";

describe("showConsentSavedToast", () => {
  it("fires a success toast with a Manage action that calls onManage", () => {
    const onManage = vi.fn();
    showConsentSavedToast({
      saved: "Saved",
      description: "Change in settings",
      manage: "Manage",
      onManage,
    });
    expect(toast.success).toHaveBeenCalledTimes(1);
    const [msg, opts] = (toast.success as any).mock.calls[0];
    expect(msg).toBe("Saved");
    expect(opts.description).toBe("Change in settings");
    expect(opts.action.label).toBe("Manage");
    opts.action.onClick();
    expect(onManage).toHaveBeenCalledTimes(1);
  });

  it("fires a bare confirmation toast with no action when manage is omitted (legal re-acceptance)", () => {
    (toast.success as any).mockClear();
    showConsentSavedToast({ saved: "Policies accepted" });
    expect(toast.success).toHaveBeenCalledTimes(1);
    const [msg, opts] = (toast.success as any).mock.calls[0];
    expect(msg).toBe("Policies accepted");
    expect(opts.action).toBeUndefined();
  });
});
