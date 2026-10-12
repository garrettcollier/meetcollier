import { getModeCapabilities, modeLabels, parseOperatingMode } from "./operating-mode";

const operatingMode = parseOperatingMode(process.env.NEXT_PUBLIC_OPERATING_MODE);
const publicContactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "garrettcollierbusiness@gmail.com";
const publicContactPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "501-762-1850";
const publicContactPhoneUri = `+1${publicContactPhone.replace(/\D/g, "")}`;
const publicCalLink =
  process.env.NEXT_PUBLIC_CAL_LINK?.trim().replace(/^https?:\/\/(?:www\.)?cal\.com\//, "") ||
  "garrettcollier/15min";

export const siteConfig = {
  name: "Meet Collier",
  wordmark: "MEETCOLLIER.",
  owner: "Garrett Collier",
  description:
    "An independent community platform for accessible public service and personal connection in Hot Springs, Arkansas.",
  tagline: "Public Service. Personal Connection.",
  headline: "Your Voice. Your Community. Your Government.",
  supportingCopy:
    "Connect with Garrett Collier, share what’s important to you, and stay informed about the work happening in our community.",
  locale: "en-US",
  timezone: "America/Chicago",
  city: "Hot Springs",
  state: "Arkansas",
  district: "City Director District 5",
  publicRole: "Hot Springs community member",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  operatingMode,
  modeLabel: modeLabels[operatingMode],
  capabilities: getModeCapabilities(operatingMode),
  electionDate: "2026-11-03",
  potentialTermStart: "2027-01-01",
  contact: {
    email: publicContactEmail,
    phone: publicContactPhone,
    phoneUri: publicContactPhoneUri,
    phoneGuidance:
      "Text messages are preferred. If I miss your call, please leave a voicemail with your name, callback number, and a brief reason for calling. I’ll return your call as soon as I’m able. Please do not include sensitive personal information.",
  },
  scheduling: {
    calLink: publicCalLink,
    bookingUrl: `https://cal.com/${publicCalLink}`,
    durationMinutes: 15,
  },
  disclosure:
    "Meet Collier is independently operated and is not the official website of the City of Hot Springs.",
} as const;

export const publicNavigation = [
  { label: "Meet", href: "/meet" },
  { label: "Get help", href: "/help" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
] as const;
