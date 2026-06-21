import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validation";
import { pageMetadata, personJsonLd } from "@/lib/seo";
import { getContactChannels, contact } from "@/lib/site";

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    const r = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to talk about evaluation infrastructure.",
      company: "",
    });
    expect(r.success).toBe(true);
  });
  it("rejects bad email and short message", () => {
    expect(
      contactSchema.safeParse({
        name: "A",
        email: "not-an-email",
        message: "hi",
      }).success,
    ).toBe(false);
  });
  it("rejects a filled honeypot", () => {
    expect(
      contactSchema.safeParse({
        name: "Bot",
        email: "bot@example.com",
        message: "buy followers now please okay",
        company: "spam co",
      }).success,
    ).toBe(false);
  });
});

describe("seo", () => {
  it("builds a canonical url for a route", () => {
    const m = pageMetadata({ title: "Systems", path: "/systems" });
    expect(m.alternates?.canonical).toContain("/systems");
    expect(m.title).toBe("Systems");
  });
  it("person structured data uses the legal name and links GitHub", () => {
    const ld = personJsonLd();
    expect(ld.name).toBe("Hari Krishna Kancharla");
    expect(ld.sameAs).toContain("https://github.com/harihkk");
  });
});

describe("contact channels", () => {
  it("hides LinkedIn until configured, always exposes email + github + résumé", () => {
    const channels = getContactChannels();
    const keys = channels.map((c) => c.key);
    expect(keys).toContain("email");
    expect(keys).toContain("github");
    expect(keys).toContain("resume");
    if (!contact.linkedin) expect(keys).not.toContain("linkedin");
  });
  it("does not expose a phone channel", () => {
    const channels = getContactChannels();
    expect(channels.some((c) => /\d{3}-\d{3}-\d{4}/.test(c.value))).toBe(false);
  });
});
