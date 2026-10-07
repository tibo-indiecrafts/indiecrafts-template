import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import DashboardLoading from "./loading";

describe("DashboardLoading", () => {
  it("announces the wait in a status region", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DashboardLoading />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("status").textContent).toBe("Loading…");
  });
});
