import { scrapeWebsite, ScrapeResult } from "@/lib/scraper";

// Mock global fetch
global.fetch = jest.fn();

describe("scrapeWebsite", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns screenshot and HTML content for a valid URL", async () => {
    const mockFetch = global.fetch as jest.Mock;

    // Mock Browserless screenshot endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: () =>
        Promise.resolve(new Uint8Array([137, 80, 78, 71]).buffer),
    });

    // Mock Browserless content endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              results: [
                {
                  html: "<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>",
                  text: "Hello",
                },
              ],
            },
          ],
        }),
    });

    const result = await scrapeWebsite("https://example.com");

    expect(result).toHaveProperty("screenshot");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("textContent");
    expect(result.html).toContain("<h1>Hello</h1>");
  });

  it("throws on network error", async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(scrapeWebsite("https://example.com")).rejects.toThrow(
      "Failed to scrape website"
    );
  });
});
