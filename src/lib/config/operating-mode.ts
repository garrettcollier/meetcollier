export const operatingModes = [
  "PRE_ELECTION",
  "ELECTED_TRANSITION",
  "IN_OFFICE",
  "PRIVATE_CITIZEN",
  "ARCHIVED_OFFICE",
] as const;

export type OperatingMode = (typeof operatingModes)[number];

const modeSet = new Set<string>(operatingModes);

export function parseOperatingMode(value: string | undefined): OperatingMode {
  if (value && modeSet.has(value)) {
    return value as OperatingMode;
  }

  return "PRE_ELECTION";
}

export type ModeCapabilities = {
  officeholderTitle: boolean;
  constituentIntake: boolean;
  boardUpdates: boolean;
  meetingBooking: boolean;
  historicalContentOnly: boolean;
};

const capabilitiesByMode: Record<OperatingMode, ModeCapabilities> = {
  PRE_ELECTION: {
    officeholderTitle: false,
    constituentIntake: false,
    boardUpdates: false,
    meetingBooking: true,
    historicalContentOnly: false,
  },
  ELECTED_TRANSITION: {
    officeholderTitle: false,
    constituentIntake: false,
    boardUpdates: false,
    meetingBooking: true,
    historicalContentOnly: false,
  },
  IN_OFFICE: {
    officeholderTitle: true,
    constituentIntake: true,
    boardUpdates: true,
    meetingBooking: true,
    historicalContentOnly: false,
  },
  PRIVATE_CITIZEN: {
    officeholderTitle: false,
    constituentIntake: false,
    boardUpdates: false,
    meetingBooking: true,
    historicalContentOnly: false,
  },
  ARCHIVED_OFFICE: {
    officeholderTitle: false,
    constituentIntake: false,
    boardUpdates: false,
    meetingBooking: false,
    historicalContentOnly: true,
  },
};

export function getModeCapabilities(mode: OperatingMode): ModeCapabilities {
  return capabilitiesByMode[mode];
}

export const modeLabels: Record<OperatingMode, string> = {
  PRE_ELECTION: "Independent community platform",
  ELECTED_TRANSITION: "Transition period",
  IN_OFFICE: "Constituent service platform",
  PRIVATE_CITIZEN: "Independent community platform",
  ARCHIVED_OFFICE: "Historical archive",
};
