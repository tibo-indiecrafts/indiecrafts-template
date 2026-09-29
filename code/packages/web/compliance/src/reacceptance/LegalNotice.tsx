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
import {
  readLegalConsent,
  writeLegalConsent,
} from "@indiecrafts/packages-shared-compliance/shared";
import { useConsent } from "../consent/useConsent";
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
};

/**
 * "We updated our policies — please Accept" banner — the shared
 * `LegalReacceptancePrompt` (the same banner as the `app` surface), with the website's
 * locale `Link`. The layout renders it only when the
 * deposited `legal-ack` cookie differs from the live version, so this component just
 * writes the cookie on Accept and hides — no polling. i18n-agnostic: copy in as props.
 *
 * Stacks ABOVE the cookie banner while cookie consent is still undecided (both are
 * bottom-fixed); drops to the resting position once consent is decided.
 */
export function LegalNotice({
  version,
  message,
  hrefs,
  acceptLabel,
  apiUrl,
  getToken,
}: Props) {
  const [accepted, setAccepted] = useState(false);
  const { decided } = useConsent();
  const t = useTranslations("legal");

  // Signed-in: pull the server-recorded acceptance. If they already accepted THIS
  // version on another surface (app · mobile), deposit the cookie + hide — so the
  // banner clears here too. The server-cookie gate in the layout still handles the
  // common anonymous case with no flash; this only covers the cross-surface case.
  useEffect(() => {
    if (!getToken || !apiUrl) return;
    let alive = true;
    void readLegalConsent({ apiUrl, getToken }).then((acked) => {
      if (alive && acked === version) {
        acceptLegal(version);
        setAccepted(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [getToken, apiUrl, version]);

  if (accepted) return null;
  return (
    <LegalReacceptancePrompt
      message={message}
      hrefs={hrefs}
      acceptLabel={acceptLabel}
      raised={!decided}
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
