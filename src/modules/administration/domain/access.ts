export type AdminAccessInput = {
  configured: boolean;
  hasVerifiedIdentity: boolean;
  assuranceLevel: "aal1" | "aal2" | null;
};

export type AdminAccessDecision =
  | "ALLOW"
  | "CONFIGURATION_REQUIRED"
  | "SIGN_IN_REQUIRED"
  | "MFA_REQUIRED";

export function getAdminAccessDecision({
  configured,
  hasVerifiedIdentity,
  assuranceLevel,
}: AdminAccessInput): AdminAccessDecision {
  if (!configured) return "CONFIGURATION_REQUIRED";
  if (!hasVerifiedIdentity) return "SIGN_IN_REQUIRED";
  if (assuranceLevel !== "aal2") return "MFA_REQUIRED";
  return "ALLOW";
}
