import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/fr.json";
import { BackupsTable, type BackupsStatus } from "./backups-table";

const status: BackupsStatus = {
  bucket: "backups-dev",
  retentionDays: 30,
  preMigrationSnapshots: true,
  runs: [
    {
      dbName: "main",
      env: "dev",
      kind: "daily",
      status: "ok",
      bytes: 1536,
      error: null,
      startedAt: "2026-10-01T23:30:00.000Z",
      finishedAt: "2026-10-01T23:31:00.000Z",
    },
  ],
};

// Client component, server-rendered first: dates and sizes must come from the admin
// locale + UTC zone, or the server and browser renders differ (hydration mismatch).
describe("BackupsTable", () => {
  it("formats run times in the admin locale and UTC", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={messages} timeZone="UTC">
        <BackupsTable status={status} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText(/1 oct\. 2026.*23:30/)).toBeTruthy();
    expect(screen.getByText(/1 oct\. 2026.*23:31/)).toBeTruthy();
  });

  it("formats the backup size in the admin locale", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={messages} timeZone="UTC">
        <BackupsTable status={status} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText(/1,5\s?ko/)).toBeTruthy();
  });
});
