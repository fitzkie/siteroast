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
    throw new Error(`Lighthouse audit failed: ${response.statusText}`);
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
}
