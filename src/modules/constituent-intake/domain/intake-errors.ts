export class IntakeRateLimitedError extends Error {
  constructor() {
    super("Too many requests were received. Please wait before trying again.");
    this.name = "IntakeRateLimitedError";
  }
}

export class DuplicateIntakeError extends Error {
  constructor() {
    super("This request appears to have already been submitted.");
    this.name = "DuplicateIntakeError";
  }
}

export class BotVerificationError extends Error {
  constructor() {
    super("The security check could not be verified.");
    this.name = "BotVerificationError";
  }
}

export class IntakeConfigurationError extends Error {
  constructor() {
    super("The assistance service is not configured.");
    this.name = "IntakeConfigurationError";
  }
}
