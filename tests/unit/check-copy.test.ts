import { describe, it, expect } from "vitest";
import { scanText, BANNED } from "../../scripts/check-copy.mjs";

describe("copy gate (em-dash scanner)", () => {
  it("flags a literal em dash", () => {
    const hits = scanText("This is fine. This is not—it has an em dash.");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].label).toContain("U+2014");
  });

  it("flags em-dash HTML entities", () => {
    expect(scanText("a &mdash; b").length).toBe(1);
    expect(scanText("a &#8212; b").length).toBe(1);
    expect(scanText("a &#x2014; b").length).toBe(1);
  });

  it("passes clean copy with hyphens, colons, and commas", () => {
    const clean =
      "Red to green: the test failed, then passed. Built with a state-machine helper.";
    expect(scanText(clean)).toEqual([]);
  });

  it("reports the correct 1-based line number", () => {
    const hits = scanText("line one\nline two has — here\nline three");
    expect(hits[0].line).toBe(2);
  });

  it("exposes the banned pattern list", () => {
    expect(BANNED.map((b) => b.label)).toContain("&mdash;");
  });
});
