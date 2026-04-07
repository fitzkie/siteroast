import Anthropic from "@anthropic-ai/sdk";
import { LighthouseScores } from "./lighthouse";

export interface CategoryResult {
  score: number;
  roast: string;
  findings: Array<{
    text: string;
    severity: "critical" | "warning" | "nice-to-have";
  }>;
  fixFirst: string;
}

export interface RoastResult {
  overallScore: number;
  overallRoast: string;
  categories: {
    firstImpressions: CategoryResult;
    seoHealth: CategoryResult;
    conversionCopy: CategoryResult;
    designUx: CategoryResult;
    technicalPerformance: CategoryResult;
    trustCredibility: CategoryResult;
  };
}

interface AnalyzerInput {
  url: string;
  html: string;
  textContent: string;
  lighthouseScores: LighthouseScores;
}

export async function generateRoast(input: AnalyzerInput): Promise<RoastResult> {
  const client = new Anthropic();

  const prompt = `You are SiteRoast, a brutally honest but constructive website auditor with a sharp sense of humor. Analyze this website and provide a "roast" — witty, direct feedback that's entertaining but genuinely actionable.

Website URL: ${input.url}

Lighthouse Performance Score: ${input.lighthouseScores.performance}/100
Lighthouse Accessibility Score: ${input.lighthouseScores.accessibility}/100
Lighthouse SEO Score: ${input.lighthouseScores.seo}/100
Lighthouse Best Practices Score: ${input.lighthouseScores.bestPractices}/100
First Contentful Paint: ${input.lighthouseScores.firstContentfulPaint}ms
Largest Contentful Paint: ${input.lighthouseScores.largestContentfulPaint}ms
Total Blocking Time: ${input.lighthouseScores.totalBlockingTime}ms
Cumulative Layout Shift: ${input.lighthouseScores.cumulativeLayoutShift}
Speed Index: ${input.lighthouseScores.speedIndex}ms

HTML Content (first 15000 chars):
${input.html.slice(0, 15000)}

Visible Text Content (first 5000 chars):
${input.textContent.slice(0, 5000)}

Respond with ONLY a JSON object (no markdown, no code fences) with this exact structure:
{
  "overallScore": <number 0-100>,
  "overallRoast": "<one witty sentence summarizing the whole site>",
  "categories": {
    "firstImpressions": { "score": <0-100>, "roast": "<2-3 sentences>", "findings": [{"text": "...", "severity": "critical|warning|nice-to-have"}, ...3 total], "fixFirst": "<one recommendation>" },
    "seoHealth": { same structure },
    "conversionCopy": { same structure },
    "designUx": { same structure },
    "technicalPerformance": { same structure },
    "trustCredibility": { same structure }
  }
}

Rules:
- Be funny but NEVER mean-spirited. Think "roast from a friend who wants you to succeed."
- Every finding must be specific and actionable.
- Technical categories anchor to Lighthouse data; subjective categories are your assessment.
- Each category must have exactly 3 findings: one critical, one warning, one nice-to-have.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const parsed = JSON.parse(text) as RoastResult;
  return parsed;
}
