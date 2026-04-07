export interface ScrapeResult {
  screenshot: Buffer;
  html: string;
  textContent: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.BROWSERLESS_API_KEY;
  const browserlessUrl = `https://chrome.browserless.io`;

  try {
    const [screenshotResponse, contentResponse] = await Promise.all([
      fetch(`${browserlessUrl}/screenshot?token=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: {
            fullPage: true,
            type: "png",
          },
          gotoOptions: {
            waitUntil: "networkidle2",
            timeout: 15000,
          },
        }),
      }),
      fetch(`${browserlessUrl}/scrape?token=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          elements: [{ selector: "html" }],
          gotoOptions: {
            waitUntil: "networkidle2",
            timeout: 15000,
          },
        }),
      }),
    ]);

    if (!screenshotResponse.ok || !contentResponse.ok) {
      throw new Error("Browserless API returned an error");
    }

    const screenshotBuffer = Buffer.from(
      await screenshotResponse.arrayBuffer()
    );
    const contentData = await contentResponse.json();
    const htmlContent = contentData.data?.[0]?.results?.[0]?.html ?? "";
    const textContent = contentData.data?.[0]?.results?.[0]?.text ?? "";

    return {
      screenshot: screenshotBuffer,
      html: htmlContent,
      textContent,
    };
  } catch (error) {
    throw new Error(
      `Failed to scrape website: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
