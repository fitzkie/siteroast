import {
  generateSlug,
  validateUrl,
  scoreToGrade,
  extractDomain,
} from "@/lib/utils";

describe("generateSlug", () => {
  it("returns a 12-character URL-safe string", () => {
    const slug = generateSlug();
    expect(slug).toHaveLength(12);
    expect(slug).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("generates unique slugs", () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateSlug()));
    expect(slugs.size).toBe(100);
  });
});

describe("validateUrl", () => {
  it("accepts valid http URLs", () => {
    expect(validateUrl("https://example.com")).toBe(true);
    expect(validateUrl("http://example.com")).toBe(true);
    expect(validateUrl("https://sub.example.com/path?q=1")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(validateUrl("")).toBe(false);
    expect(validateUrl("not-a-url")).toBe(false);
    expect(validateUrl("ftp://example.com")).toBe(false);
    expect(validateUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects localhost and private IPs", () => {
    expect(validateUrl("http://localhost")).toBe(false);
    expect(validateUrl("http://127.0.0.1")).toBe(false);
    expect(validateUrl("http://192.168.1.1")).toBe(false);
    expect(validateUrl("http://10.0.0.1")).toBe(false);
  });
});

describe("scoreToGrade", () => {
  it("returns correct grade for score ranges", () => {
    expect(scoreToGrade(95)).toBe("A");
    expect(scoreToGrade(85)).toBe("B");
    expect(scoreToGrade(75)).toBe("C");
    expect(scoreToGrade(65)).toBe("D");
    expect(scoreToGrade(50)).toBe("F");
  });

  it("handles boundary values", () => {
    expect(scoreToGrade(90)).toBe("A");
    expect(scoreToGrade(80)).toBe("B");
    expect(scoreToGrade(70)).toBe("C");
    expect(scoreToGrade(60)).toBe("D");
    expect(scoreToGrade(59)).toBe("F");
    expect(scoreToGrade(0)).toBe("F");
    expect(scoreToGrade(100)).toBe("A");
  });
});

describe("extractDomain", () => {
  it("extracts domain from URL", () => {
    expect(extractDomain("https://www.example.com/path")).toBe("www.example.com");
    expect(extractDomain("https://example.com")).toBe("example.com");
  });
});
