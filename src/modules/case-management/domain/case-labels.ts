const statusLabels: Record<string, string> = {
  ACKNOWLEDGED: "Acknowledged",
  AWAITING_RESPONSE: "Awaiting response",
  CLOSED_WITHOUT_RESOLUTION: "Closed without resolution",
  FOLLOW_UP_REQUIRED: "Follow-up required",
  NEW: "New",
  REFERRED_TO_APPROPRIATE_AGENCY: "Referred to appropriate agency",
  RESOLVED: "Resolved",
  UNDER_REVIEW: "Under review",
};

export function getCaseStatusLabel(status: string) {
  return statusLabels[status] ?? status.replaceAll("_", " ").toLowerCase();
}

export function formatCaseDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(value));
}
