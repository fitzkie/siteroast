import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#111827", color: "#ffffff", fontFamily: "Helvetica" },
  header: { marginBottom: 30, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#f97316", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#9ca3af" },
  scoreSection: { textAlign: "center", marginBottom: 30, padding: 20, backgroundColor: "#1f2937", borderRadius: 12 },
  bigScore: { fontSize: 48, fontWeight: "bold", color: "#f97316" },
  grade: { fontSize: 24, color: "#9ca3af", marginTop: 4 },
  roastQuote: { fontSize: 14, color: "#d1d5db", fontStyle: "italic", marginTop: 12, textAlign: "center" },
  categoryCard: { marginBottom: 20, padding: 16, backgroundColor: "#1f2937", borderRadius: 8 },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  categoryTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  categoryScore: { fontSize: 16, fontWeight: "bold", color: "#f97316" },
  categoryRoast: { fontSize: 11, color: "#d1d5db", fontStyle: "italic", marginBottom: 10 },
  finding: { fontSize: 10, color: "#e5e7eb", marginBottom: 4, paddingLeft: 8 },
  severityLabel: { fontSize: 8, fontWeight: "bold" },
  critical: { color: "#f87171" },
  warning: { color: "#fbbf24" },
  niceToHave: { color: "#60a5fa" },
  fixFirst: { fontSize: 11, color: "#fb923c", marginTop: 8, padding: 8, backgroundColor: "#7c2d12", borderRadius: 4 },
  fixFirstText: { color: "#fdba74", fontSize: 10, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 10, color: "#6b7280" },
});

const categoryTitles: Record<string, string> = {
  firstImpressions: "First Impressions", seoHealth: "SEO Health", conversionCopy: "Conversion Copy",
  designUx: "Design & UX", technicalPerformance: "Technical Performance", trustCredibility: "Trust & Credibility",
};

interface ReportPdfProps {
  url: string; overallScore: number; overallGrade: string;
  report: { overallRoast: string; categories: Record<string, { score: number; roast: string; findings: Array<{ text: string; severity: string }>; fixFirst: string; }>; };
  shareUrl: string;
}

export function ReportPdf({ url, overallScore, overallGrade, report, shareUrl }: ReportPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>SiteRoast Report</Text>
          <Text style={styles.subtitle}>{url}</Text>
        </View>
        <View style={styles.scoreSection}>
          <Text style={styles.bigScore}>{overallScore}/100</Text>
          <Text style={styles.grade}>Grade: {overallGrade}</Text>
          <Text style={styles.roastQuote}>{report.overallRoast}</Text>
        </View>
        {Object.entries(report.categories).map(([key, category]) => (
          <View key={key} style={styles.categoryCard} wrap={false}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{categoryTitles[key] || key}</Text>
              <Text style={styles.categoryScore}>{category.score}/100</Text>
            </View>
            <Text style={styles.categoryRoast}>{category.roast}</Text>
            {category.findings.map((finding, i) => (
              <View key={i} style={styles.finding}>
                <Text style={[styles.severityLabel, finding.severity === "critical" ? styles.critical : finding.severity === "warning" ? styles.warning : styles.niceToHave]}>
                  [{finding.severity}]
                </Text>
                <Text> {finding.text}</Text>
              </View>
            ))}
            <View style={styles.fixFirst}>
              <Text style={styles.fixFirstText}>Fix first: {category.fixFirst}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.footer}>{shareUrl} | Powered by SiteRoast</Text>
      </Page>
    </Document>
  );
}
