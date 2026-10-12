import { z } from "zod";

export const assistanceCategories = [
  ["roads_sidewalks", "Roads and sidewalks"],
  ["drainage_flooding", "Drainage and flooding"],
  ["street_lighting", "Street lighting"],
  ["utilities", "Utilities"],
  ["animal_control", "Animal control"],
  ["public_safety", "Public safety"],
  ["housing_development", "Housing and development"],
  ["code_enforcement", "Code enforcement"],
  ["economic_development", "Economic development"],
  ["general_question", "General question"],
  ["other", "Other"],
] as const;

export const assistanceCategoryValues = assistanceCategories.map(
  ([value]) => value,
) as [
  (typeof assistanceCategories)[number][0],
  ...(typeof assistanceCategories)[number][0][],
];

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email("Enter a valid email address.").max(254).optional(),
);

const optionalPhone = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(25, "Enter a valid phone number.")
    .regex(/^[0-9+().\-\s]+$/, "Enter a valid phone number.")
    .optional(),
);

export const assistanceRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(100),
    email: optionalEmail,
    phone: optionalPhone,
    preferredContactMethod: z.enum(["email", "text", "phone"], {
      error: "Choose how you prefer to be contacted.",
    }),
    generalLocation: optionalText(120),
    category: z.enum(assistanceCategoryValues, {
      error: "Choose an issue category.",
    }),
    subject: z.string().trim().min(5, "Enter a short subject.").max(150),
    description: z
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters so the request can be understood.")
      .max(4000, "Keep the description under 4,000 characters."),
    officialServiceRequestReference: optionalText(100),
    consent: z.literal(true, {
      error: "You must acknowledge the privacy notice before submitting.",
    }),
    turnstileToken: z.string().min(1, "Complete the security check.").max(2048),
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone) {
      context.addIssue({
        code: "custom",
        message: "Provide an email address or phone number.",
        path: ["email"],
      });
      context.addIssue({
        code: "custom",
        message: "Provide an email address or phone number.",
        path: ["phone"],
      });
    }

    if (value.preferredContactMethod === "email" && !value.email) {
      context.addIssue({
        code: "custom",
        message: "Enter an email address or choose text message or phone call as your preference.",
        path: ["email"],
      });
    }

    if (
      (value.preferredContactMethod === "text" || value.preferredContactMethod === "phone") &&
      !value.phone
    ) {
      context.addIssue({
        code: "custom",
        message: "Enter a phone number or choose email as your preference.",
        path: ["phone"],
      });
    }
  });

export type AssistanceRequest = z.infer<typeof assistanceRequestSchema>;
export type AssistanceCategory = AssistanceRequest["category"];

export function getAssistanceCategoryLabel(category: AssistanceCategory) {
  return assistanceCategories.find(([value]) => value === category)?.[1] ?? "Other";
}
