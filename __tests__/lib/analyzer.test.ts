import { generateRoast, RoastResult } from "@/lib/analyzer";

// Mock the Anthropic SDK
jest.mock("@anthropic-ai/sdk", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                overallScore: 62,
                overallRoast: "Your website looks like it was designed during a coffee shortage.",
                categories: {
                  firstImpressions: {
                    score: 55, roast: "Your hero section is hiding.",
                    findings: [
                      { text: "No clear value proposition above the fold", severity: "critical" },
                      { text: "Hero image is 4MB uncompressed", severity: "warning" },
                      { text: "Consider adding a subheading", severity: "nice-to-have" },
                    ],
                    fixFirst: "Add a clear one-sentence value prop above the fold",
                  },
                  seoHealth: {
                    score: 70, roast: "Google can find you, but it's not impressed.",
                    findings: [
                      { text: "Missing meta description", severity: "critical" },
                      { text: "H1 tag is generic", severity: "warning" },
                      { text: "Add structured data markup", severity: "nice-to-have" },
                    ],
                    fixFirst: "Write a compelling meta description under 160 characters",
                  },
                  conversionCopy: {
                    score: 50, roast: "Your CTA says 'Submit'. Groundbreaking.",
                    findings: [
                      { text: "CTA button text is generic", severity: "critical" },
                      { text: "No social proof visible", severity: "warning" },
                      { text: "Add urgency elements", severity: "nice-to-have" },
                    ],
                    fixFirst: "Replace 'Submit' with an action-oriented CTA",
                  },
                  designUx: {
                    score: 65, roast: "The design is aggressively forgettable.",
                    findings: [
                      { text: "Low color contrast on body text", severity: "critical" },
                      { text: "Inconsistent spacing", severity: "warning" },
                      { text: "Consider a more modern font pairing", severity: "nice-to-have" },
                    ],
                    fixFirst: "Fix text contrast ratio to meet WCAG AA (4.5:1)",
                  },
                  technicalPerformance: {
                    score: 72, roast: "Your site loads on a diet of render-blocking resources.",
                    findings: [
                      { text: "3 render-blocking scripts in head", severity: "critical" },
                      { text: "Images not using next-gen formats", severity: "warning" },
                      { text: "Consider lazy loading below-fold images", severity: "nice-to-have" },
                    ],
                    fixFirst: "Defer or async the 3 render-blocking scripts",
                  },
                  trustCredibility: {
                    score: 60, roast: "No privacy policy, using a Gmail address. Very professional.",
                    findings: [
                      { text: "No privacy policy found", severity: "critical" },
                      { text: "Contact email is a free email provider", severity: "warning" },
                      { text: "Add customer testimonials", severity: "nice-to-have" },
                    ],
                    fixFirst: "Add a privacy policy page",
                  },
                },
              }),
            },
          ],
        }),
      },
    })),
  };
});

describe("generateRoast", () => {
  it("returns structured roast with all 6 categories", async () => {
    const result = await generateRoast({
      url: "https://example.com",
      html: "<html><body><h1>Test</h1></body></html>",
      textContent: "Test",
      lighthouseScores: {
        performance: 72, accessibility: 85, seo: 70, bestPractices: 80,
        firstContentfulPaint: 1200, largestContentfulPaint: 2500,
        totalBlockingTime: 150, cumulativeLayoutShift: 0.1,
        speedIndex: 2000, rawData: {},
      },
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.overallRoast).toBeTruthy();
    expect(result.categories).toHaveProperty("firstImpressions");
    expect(result.categories).toHaveProperty("seoHealth");
    expect(result.categories).toHaveProperty("conversionCopy");
    expect(result.categories).toHaveProperty("designUx");
    expect(result.categories).toHaveProperty("technicalPerformance");
    expect(result.categories).toHaveProperty("trustCredibility");

    const category = result.categories.firstImpressions;
    expect(category.score).toBeGreaterThanOrEqual(0);
    expect(category.roast).toBeTruthy();
    expect(category.findings).toHaveLength(3);
    expect(category.findings[0]).toHaveProperty("severity");
    expect(category.fixFirst).toBeTruthy();
  });
});
