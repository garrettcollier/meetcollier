import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage communicates the current role and primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your voice");
  await expect(page.getByText("is not presented as a City officeholder")).toBeVisible();
  await expect(page.getByRole("link", { name: "Schedule a meeting", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Response standard" })).toBeVisible();
  await expect(page.getByText("by email, text message, or phone call", { exact: false })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Updates" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Priorities" })).toHaveCount(0);
});

test("assistance form fails closed until private providers are configured", async ({ page }) => {
  await page.goto("/help");

  await expect(page.getByRole("heading", { name: "Share a question or request for help." })).toBeVisible();
  await expect(page.getByText("within two business days", { exact: false })).toBeVisible();
  await expect(page.getByText("Submissions are disabled until the secure services are configured.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Setup required before submissions" })).toBeDisabled();
});

test("office hours and town halls publish a sustainable intended cadence", async ({ page }) => {
  await page.goto("/meet#office-hours");
  await expect(page.getByRole("heading", { name: "Second and fourth Saturdays" })).toBeVisible();
  await expect(page.getByText("10:00 a.m.–12:00 p.m.", { exact: false })).toBeVisible();
  await expect(page.getByText("261 Cornerstone Blvd, Hot Springs, AR 71913")).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Second and fourth Saturdays, 10:00 a.m.–12:00 p.m." })).toHaveAttribute("href", "/meet#office-hours");

  await page.goto("/events");
  await expect(page.getByText("Second Thursday of each month", { exact: false })).toBeVisible();
  await expect(page.getByText("6:00 p.m. Central Time", { exact: false })).toBeVisible();
});

test("contact page presents verified channels and text-first guidance", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("link", { name: "garrettcollierbusiness@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:garrettcollierbusiness@gmail.com",
  );
  await expect(page.getByRole("link", { name: "501-762-1850" })).toHaveAttribute(
    "href",
    "sms:+15017621850",
  );
  await expect(page.getByText("Text messages are preferred.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Response standard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call instead" })).toHaveAttribute(
    "href",
    "tel:+15017621850",
  );
});

test("meeting page presents the live Cal.com booking link and contact alternatives", async ({ page }) => {
  await page.goto("/meet");

  await expect(page.getByRole("heading", { name: "Book a 15-minute meeting" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in Cal.com" })).toHaveAttribute(
    "href",
    "https://cal.com/garrettcollier/15min",
  );
  await expect(page.getByRole("link", { name: "Text 501-762-1850" })).toHaveAttribute(
    "href",
    "sms:+15017621850",
  );
  await expect(page.getByRole("link", { name: "Email Garrett" })).toHaveAttribute(
    "href",
    "mailto:garrettcollierbusiness@gmail.com",
  );
});

test("resources page presents curated official sources without an unnecessary search placeholder", async ({ page }) => {
  await page.goto("/resources");

  await expect(page.getByText("Search and admin-managed categories", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /OpenHotSprings/ })).toHaveAttribute(
    "href",
    "https://openhotsprings.com/",
  );
  await expect(page.getByRole("link", { name: /Report a City issue/ })).toHaveAttribute(
    "href",
    "https://www.hotspringsar.gov/SCF",
  );
  await expect(page.getByRole("link", { name: /City meeting portal/ })).toHaveAttribute(
    "href",
    "https://cityhs.civicweb.net/Portal/",
  );
  await expect(page.getByText("Independent civic tool", { exact: true })).toBeVisible();
  await expect(page.getByText("For emergencies, call 911.", { exact: false })).toBeVisible();
});

test("admin routes fail closed without credentials", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login\?reason=configuration-required/);
  await expect(page.getByRole("heading", { name: "Secure sign in" })).toBeVisible();
});

test("homepage has no automatically detectable WCAG A or AA violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});
