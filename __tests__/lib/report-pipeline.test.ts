import { generateReport } from "@/lib/report-pipeline";

jest.mock("@/lib/scraper", () => ({
  scrapeWebsite: jest.fn().mockResolvedValue({
    screenshot: Buffer.from("fake-png"),
    html: "<html><body><h1>Test Site</h1></body></html>",
    textContent: "Test Site",
  }),
}));

jest.mock("@/lib/lighthouse", () => ({
  runLighthouseAudit: jest.fn().mockResolvedValue({
    performance: 75, accessibility: 88, seo: 82, bestPractices: 79,
    firstContentfulPaint: 1100, largestContentfulPaint: 2200,
    totalBlockingTime: 120, cumulativeLayoutShift: 0.05,
    speedIndex: 1800, rawData: {},
  }),
}));

jest.mock("@/lib/analyzer", () => ({
  generateRoast: jest.fn().mockResolvedValue({
    overallScore: 68,
    overallRoast: "Not bad, but your site has the personality of a parking garage.",
    categories: {
      firstImpressions: { score: 60, roast: "Your hero section is MIA.", findings: [{ text: "No hero headline", severity: "critical" }, { text: "Generic stock photo", severity: "warning" }, { text: "Add animation", severity: "nice-to-have" }], fixFirst: "Add a clear headline" },
      seoHealth: { score: 82, roast: "SEO is decent.", findings: [{ text: "Missing meta desc", severity: "critical" }, { text: "Thin content", severity: "warning" }, { text: "Add schema", severity: "nice-to-have" }], fixFirst: "Add meta description" },
      conversionCopy: { score: 55, roast: "CTAs are weak.", findings: [{ text: "No CTA above fold", severity: "critical" }, { text: "Generic button text", severity: "warning" }, { text: "Add testimonials", severity: "nice-to-have" }], fixFirst: "Add CTA above fold" },
      designUx: { score: 70, roast: "Design is passable.", findings: [{ text: "Low contrast text", severity: "critical" }, { text: "Inconsistent spacing", severity: "warning" }, { text: "Update fonts", severity: "nice-to-have" }], fixFirst: "Fix contrast" },
      technicalPerformance: { score: 75, roast: "Could be faster.", findings: [{ text: "Render blocking JS", severity: "critical" }, { text: "Large images", severity: "warning" }, { text: "Add lazy loading", severity: "nice-to-have" }], fixFirst: "Defer scripts" },
      trustCredibility: { score: 65, roast: "Trust needs work.", findings: [{ text: "No privacy policy", severity: "critical" }, { text: "No testimonials", severity: "warning" }, { text: "Add badges", severity: "nice-to-have" }], fixFirst: "Add privacy policy" },
    },
  }),
}));

describe("generateReport", () => {
  it("orchestrates scraper, lighthouse, and analyzer and returns a complete report", async () => {
    const result = await generateReport("https://example.com");
    expect(result.url).toBe("https://example.com");
    expect(result.overallScore).toBe(68);
    expect(result.overallGrade).toBe("D");
    expect(result.shareSlug).toHaveLength(12);
    expect(result.screenshot).toBeInstanceOf(Buffer);
    expect(result.roast.categories).toHaveProperty("firstImpressions");
    expect(result.lighthouseScores.performance).toBe(75);
  });
});
