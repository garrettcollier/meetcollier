import { describe, expect, it } from "vitest";

import { getAdminAccessDecision } from "./access";

describe("administrator access decision", () => {
  it("fails closed when auth is not configured", () => expect(getAdminAccessDecision({ configured: false, hasVerifiedIdentity: false, assuranceLevel: null })).toBe("CONFIGURATION_REQUIRED"));
  it("requires a verified identity", () => expect(getAdminAccessDecision({ configured: true, hasVerifiedIdentity: false, assuranceLevel: null })).toBe("SIGN_IN_REQUIRED"));
  it("requires MFA at AAL2", () => expect(getAdminAccessDecision({ configured: true, hasVerifiedIdentity: true, assuranceLevel: "aal1" })).toBe("MFA_REQUIRED"));
  it("permits an AAL2 identity to continue to authoritative role checks", () => expect(getAdminAccessDecision({ configured: true, hasVerifiedIdentity: true, assuranceLevel: "aal2" })).toBe("ALLOW"));
});
