export interface LighthouseScores {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  speedIndex: number;
  rawData: Record<string, unknown>;
}

export async function runLighthouseAudit(
  url: string
): Promise<LighthouseScores> {
  const apiKey = process.env.BROWSERLESS_API_KEY;

  try {
    const response = await fetch(
      `https://chrome.browserless.io/performance?token=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          config: {
            extends: "lighthouse:default",
          },
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Lighthouse audit failed: ${response.status} ${response.statusText} ${detail}`);
    }

    const data = await response.json();

    return {
      performance: Math.round((data.categories?.performance?.score ?? 0) * 100),
      accessibility: Math.round(
        (data.categories?.accessibility?.score ?? 0) * 100
      ),
      seo: Math.round((data.categories?.seo?.score ?? 0) * 100),
      bestPractices: Math.round(
        (data.categories?.["best-practices"]?.score ?? 0) * 100
      ),
      firstContentfulPaint:
        data.audits?.["first-contentful-paint"]?.numericValue ?? 0,
      largestContentfulPaint:
        data.audits?.["largest-contentful-paint"]?.numericValue ?? 0,
      totalBlockingTime:
        data.audits?.["total-blocking-time"]?.numericValue ?? 0,
      cumulativeLayoutShift:
        data.audits?.["cumulative-layout-shift"]?.numericValue ?? 0,
      speedIndex: data.audits?.["speed-index"]?.numericValue ?? 0,
      rawData: data,
    };
  } catch (error) {
    console.warn(
      `Lighthouse fallback for ${url}:`,
      error instanceof Error ? error.message : error
    );
    return {
      performance: 0,
      accessibility: 0,
      seo: 0,
      bestPractices: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
      speedIndex: 0,
      rawData: {},
    };
  }
}
