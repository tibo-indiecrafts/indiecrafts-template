"use client";

/**
 * Shows the legal re-acceptance banner and records acceptance.
 *
 * @see docs/reference/packages/web/compliance/src/reacceptance/LegalNotice.md
 */

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@indiecrafts/packages-web-i18n";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";
import { useOverlayTurn } from "@indiecrafts/packages-web-ui-components/web/overlay-turn";
import {
  syncLegalConsent,
  writeLegalConsent,
} from "@indiecrafts/packages-shared-compliance/shared";
import { acceptLegal } from "./legal-store";

type Props = {
  /** Effective legal version (from `getLegalAcceptance`) — deposited on Accept. */
  version: string;
  /** Banner sentence with `[[…]]` link markers, e.g. "…our [[Privacy Policy]] and [[Terms]]." */
  message: string;
  /** Ordered URLs woven into the message's markers (privacy, terms). */
  hrefs: string[];
  acceptLabel: string;
  /** api Worker base — enables the SIGNED-IN cross-surface sync when a token is supplied. */
  apiUrl?: string;
  /** Clerk session token getter (signed-in only) — supplied by `SignedInLegalNotice`. */
  getToken?: () => Promise<string | null>;
  /** The `legal-ack` cookie already holds `version`: render nothing, only make sure the
   *  server has it (the signed-in layout mounts the notice either way). */
  acceptedHere?: boolean;
};

/**
 * "We updated our policies — please Accept" banner — the shared
 * `LegalReacceptancePrompt` (the same banner as the `app` surface), with the website's
 * locale `Link`. Signed out, the layout renders it only when the deposited `legal-ack`
 * cookie differs from the live version. Signed-in builds mount it always (`acceptedHere`
 * when the cookie matches) so a lost server write is re-sent. It writes the cookie on
 * Accept and hides — no polling. i18n-agnostic: copy in as props.
 *
 * It waits its turn in the overlay queue (`useOverlayTurn`): it shows once the cookie
 * banner is gone, so the two never stack.
 */
export function LegalNotice({
  version,
  message,
  hrefs,
  acceptLabel,
  apiUrl,
  getToken,
  acceptedHere = false,
}: Props) {
  const [accepted, setAccepted] = useState(acceptedHere);
  const t = useTranslations("legal");

  // Signed-in: reconcile with the server. Accepted THIS version on another surface (app ·
  // mobile) → deposit the cookie + hide, so the banner clears here too. Accepted it HERE
  // but the server never got the write (a reload, offline, a failed token refresh) →
  // re-send it. The server-cookie gate in the layout still handles the anonymous case.
  useEffect(() => {
    if (!getToken || !apiUrl) return;
    let alive = true;
    void syncLegalConsent({
      apiUrl,
      getToken,
      version,
      surface: "website",
      acceptedHere,
    }).then((synced) => {
      if (alive && synced && !acceptedHere) {
        acceptLegal(version);
        setAccepted(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [getToken, apiUrl, version, acceptedHere]);

  const turn = useOverlayTurn("legal", !accepted);
  if (!turn) return null;
  return (
    <LegalReacceptancePrompt
      message={message}
      hrefs={hrefs}
      acceptLabel={acceptLabel}
      link={Link}
      onAccept={() => {
        acceptLegal(version);
        setAccepted(true);
        // Accepting policies is not a cookie choice — a bare confirmation, no
        // Manage-cookies action (that lives on the cookie banner's own toast).
        showConsentSavedToast({ saved: t("saved") });
        // Signed-in: record it server-side so the banner clears on the user's other
        // surfaces too (best-effort; the cookie above already hid it here).
        if (getToken && apiUrl)
          void writeLegalConsent({
            apiUrl,
            getToken,
            version,
            surface: "website",
          });
      }}
    />
  );
}
