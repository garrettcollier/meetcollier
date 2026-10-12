import { describe, expect, it } from "vitest";

import { getModeCapabilities, parseOperatingMode } from "./operating-mode";

describe("operating mode", () => {
  it("fails safely to pre-election mode", () => {
    expect(parseOperatingMode(undefined)).toBe("PRE_ELECTION");
    expect(parseOperatingMode("INVALID")).toBe("PRE_ELECTION");
  });

  it("allows ordinary meeting booking before the election without officeholder powers", () => {
    expect(getModeCapabilities("PRE_ELECTION")).toMatchObject({ meetingBooking: true, constituentIntake: false, officeholderTitle: false, boardUpdates: false });
  });

  it("enables constituent service only in office", () => {
    expect(getModeCapabilities("IN_OFFICE").constituentIntake).toBe(true);
    for (const mode of ["PRE_ELECTION", "ELECTED_TRANSITION", "PRIVATE_CITIZEN", "ARCHIVED_OFFICE"] as const) expect(getModeCapabilities(mode).constituentIntake).toBe(false);
  });

  it("disables active services for an archived office", () => {
    expect(getModeCapabilities("ARCHIVED_OFFICE")).toMatchObject({ meetingBooking: false, constituentIntake: false, historicalContentOnly: true });
  });
});
