import { describe, expect, it } from "vitest";

import { assistanceRequestSchema } from "./assistance-request";

const validRequest = {
  category: "general_question",
  consent: true,
  description: "I have a general community question that needs a reply.",
  email: "resident@example.test",
  generalLocation: "District 5",
  name: "Fictional Resident",
  officialServiceRequestReference: "",
  phone: "",
  preferredContactMethod: "email",
  subject: "Question about a public resource",
  turnstileToken: "fictional-test-token",
  website: "",
} as const;

describe("assistance request validation", () => {
  it("accepts and normalizes a minimal email request", () => {
    const result = assistanceRequestSchema.parse(validRequest);

    expect(result.email).toBe("resident@example.test");
    expect(result.phone).toBeUndefined();
    expect(result.officialServiceRequestReference).toBeUndefined();
  });

  it("requires at least one reply channel", () => {
    const result = assistanceRequestSchema.safeParse({
      ...validRequest,
      email: "",
      phone: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.phone).toBeDefined();
    }
  });

  it("requires the selected preferred contact channel", () => {
    const result = assistanceRequestSchema.safeParse({
      ...validRequest,
      email: "",
      phone: "501-555-0100",
      preferredContactMethod: "email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        "Enter an email address or choose text message or phone call as your preference.",
      );
    }
  });

  it("accepts text message as a preferred contact method when a phone number is provided", () => {
    const result = assistanceRequestSchema.parse({
      ...validRequest,
      email: "",
      phone: "501-555-0100",
      preferredContactMethod: "text",
    });

    expect(result.preferredContactMethod).toBe("text");
    expect(result.phone).toBe("501-555-0100");
  });

  it("rejects a short description and missing privacy acknowledgment", () => {
    const result = assistanceRequestSchema.safeParse({
      ...validRequest,
      consent: false,
      description: "Too short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description).toBeDefined();
      expect(result.error.flatten().fieldErrors.consent).toBeDefined();
    }
  });
});
