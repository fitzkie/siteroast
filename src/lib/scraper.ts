export interface ScrapeResult {
  screenshot: Buffer;
  html: string;
  textContent: string;
}

const EMPTY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnK8f8AAAAASUVORK5CYII=";

function placeholderScreenshot(): Buffer {
  return Buffer.from(EMPTY_PNG_BASE64, "base64");
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fallbackFetchWebsite(url: string): Promise<{
  html: string;
  textContent: string;
}> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SiteRoastBot/1.0; +https://siteroast-production-52f4.up.railway.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Fallback fetch failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return {
    html,
    textContent: extractTextFromHtml(html),
  };
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.BROWSERLESS_API_KEY;
  const browserlessUrl = `https://chrome.browserless.io`;

  try {
    const [screenshotResult, contentResult] = await Promise.allSettled([
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
            waitUntil: "load",
            timeout: 20000,
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
            waitUntil: "load",
            timeout: 20000,
          },
        }),
      }),
    ]);

    let screenshot = placeholderScreenshot();
    if (screenshotResult.status === "fulfilled") {
      if (screenshotResult.value.ok) {
        screenshot = Buffer.from(await screenshotResult.value.arrayBuffer());
      } else {
        const detail = await screenshotResult.value.text();
        console.warn("Browserless screenshot failed:", detail);
      }
    } else {
      console.warn("Browserless screenshot request failed:", screenshotResult.reason);
    }

    let htmlContent = "";
    let textContent = "";

    if (contentResult.status === "fulfilled" && contentResult.value.ok) {
      const contentData = await contentResult.value.json();
      htmlContent = contentData.data?.[0]?.results?.[0]?.html ?? "";
      textContent = contentData.data?.[0]?.results?.[0]?.text ?? "";
    } else {
      if (contentResult.status === "fulfilled") {
        const detail = await contentResult.value.text();
        console.warn("Browserless scrape failed:", detail);
      } else {
        console.warn("Browserless scrape request failed:", contentResult.reason);
      }

      const fallback = await fallbackFetchWebsite(url);
      htmlContent = fallback.html;
      textContent = fallback.textContent;
    }

    if (!htmlContent && !textContent) {
      const fallback = await fallbackFetchWebsite(url);
      htmlContent = fallback.html;
      textContent = fallback.textContent;
    }

    return {
      screenshot,
      html: htmlContent,
      textContent,
    };
  } catch (error) {
    throw new Error(
      `Failed to scrape website: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
