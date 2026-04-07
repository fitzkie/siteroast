import { scrapeWebsite } from "./scraper";
import { runLighthouseAudit, LighthouseScores } from "./lighthouse";
import { generateRoast, RoastResult } from "./analyzer";
import { generateSlug, scoreToGrade } from "./utils";

export interface ReportResult {
  url: string;
  overallScore: number;
  overallGrade: string;
  shareSlug: string;
  screenshot: Buffer;
  roast: RoastResult;
  lighthouseScores: LighthouseScores;
}

export async function generateReport(url: string): Promise<ReportResult> {
  const [scrapeResult, lighthouseScores] = await Promise.all([
    scrapeWebsite(url),
    runLighthouseAudit(url),
  ]);

  const roast = await generateRoast({
    url,
    html: scrapeResult.html,
    textContent: scrapeResult.textContent,
    lighthouseScores,
  });

  return {
    url,
    overallScore: roast.overallScore,
    overallGrade: scoreToGrade(roast.overallScore),
    shareSlug: generateSlug(),
    screenshot: scrapeResult.screenshot,
    roast,
    lighthouseScores,
  };
}
