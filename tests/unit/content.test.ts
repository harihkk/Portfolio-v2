import { describe, it, expect } from "vitest";
import {
  provenance,
  approvedProvenance,
  heldProvenance,
  isApproved,
} from "@/content/provenance";
import { metrics, approvedMetrics } from "@/content/metrics";
import { systems, systemSlugs } from "@/content/systems";
import { research } from "@/content/research";
import { archive } from "@/content/archive";
import { experience } from "@/content/experience";
import { earlierWork } from "@/content/earlier-work";

const PHONE = "508-293-1724";

describe("provenance ledger", () => {
  it("has unique ids", () => {
    const ids = provenance.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never exposes the phone number in any record text", () => {
    for (const r of provenance) {
      expect(r.text).not.toContain(PHONE);
      expect(r.sourceLocation).not.toContain(PHONE);
    }
  });

  it("keeps held items unapproved (KL University, Rlogical, undergrad, LinkedIn)", () => {
    for (const id of [
      "held-kl-university",
      "held-rlogical",
      "held-undergrad",
      "held-linkedin",
    ]) {
      expect(isApproved(id)).toBe(false);
    }
    expect(heldProvenance.length).toBeGreaterThanOrEqual(4);
    expect(approvedProvenance.every((r) => r.publicApproved)).toBe(true);
  });
});

describe("metrics", () => {
  it("only exposes approved metrics", () => {
    expect(approvedMetrics.every((m) => m.approved)).toBe(true);
    expect(approvedMetrics.length).toBe(metrics.length);
  });
  it("non-numeric metrics are not animated", () => {
    for (const m of metrics) {
      if (m.value === null) expect(m.animate).toBe(false);
    }
  });
});

describe("systems", () => {
  it("has exactly the four flagship slugs", () => {
    expect(systemSlugs.sort()).toEqual(
      [
        "code-review-arena",
        "contamcheckr",
        "debugbrief",
        "helm-browser-agent",
      ].sort(),
    );
  });
  it("every system has limitations stated and a verified commit", () => {
    for (const s of systems) {
      expect(s.limitations.length).toBeGreaterThan(0);
      expect(s.lastVerifiedCommit).toBeTruthy();
      expect(s.repo).toMatch(/^https:\/\/github\.com\/harihkk\//);
    }
  });
  it("only DebugBrief is marked published (PyPI)", () => {
    const published = systems.filter((s) => s.published);
    expect(published.map((s) => s.slug)).toEqual(["debugbrief"]);
  });
});

describe("research desk", () => {
  it("has 14 external papers, none authored by Hari", () => {
    expect(research.length).toBe(14);
    expect(research.every((p) => p.authoredByHari === false)).toBe(true);
    expect(research.every((p) => p.recordType === "READING")).toBe(true);
  });
  it("every paper has an arXiv id and url", () => {
    for (const p of research) {
      expect(p.arxivId).toMatch(/^\d{4}\.\d{4,5}$/);
      expect(p.arxivUrl).toContain("arxiv.org/abs/");
    }
  });
});

describe("archive + experience", () => {
  it("archive is sorted newest-first and has sources", () => {
    for (let i = 1; i < archive.length; i++) {
      expect(archive[i - 1].date >= archive[i].date).toBe(true);
    }
    expect(archive.every((e) => e.source.length > 0)).toBe(true);
  });
  it("experience uses résumé titles (Machine Learning Engineer, not the old title)", () => {
    const ii = experience.find((e) => e.id === "infinite-infolab");
    expect(ii?.role).toBe("Machine Learning Engineer");
  });
  it("earlier work omits weather-dashboard and only shows verified live links", () => {
    expect(
      earlierWork.find((p) => p.name === "weather-dashboard"),
    ).toBeUndefined();
    for (const p of earlierWork) {
      if (p.live) expect(p.liveVerified).toBe(true);
    }
  });
});
