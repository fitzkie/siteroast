"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScoreBadge } from "@/components/score-badge";

interface ReportSummary { id: string; url: string; overallScore: number; overallGrade: string; shareSlug: string; isPreview: boolean; createdAt: string; }

function formatReportDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      fetch("/api/dashboard/reports").then((r) => r.json()).then((data) => { setReports(data.reports || []); setIsLoading(false); });
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (<div className="min-h-screen bg-[#090909] text-[#f5f1e8]"><Nav /><div className="flex items-center justify-center pt-24"><p className="text-[#9f9888]">Loading...</p></div></div>);
  }

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f1e8]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Reports</h1>
          <div className="flex gap-4">
            <Link href="/dashboard/billing" className="rounded-full border border-[#40361f] bg-[#191919] px-4 py-2 text-sm text-[#d4cfc1] hover:border-[#5f4b19] hover:bg-[#1d1b16]">Manage Billing</Link>
            <Link href="/" className="rounded-full bg-[#e4b63b] px-4 py-2 text-sm font-medium text-[#111111] hover:bg-[#f5c74d]">New Roast</Link>
          </div>
        </div>
        {reports.length === 0 ? (
          <div className="py-16 text-center"><p className="text-lg text-[#9f9888]">No reports yet.</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-[#e4b63b] px-6 py-3 font-semibold text-[#111111] hover:bg-[#f5c74d]">Roast Your First Site</Link></div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link key={report.id} href={`/report/${report.shareSlug}`} className="flex items-center justify-between rounded-[24px] border border-[#2b2619] bg-[#141414] p-6 hover:border-[#5f4b19]">
                <div><p className="text-lg font-medium text-[#f5f1e8]">{report.url}</p>
                  <p className="text-sm text-[#9f9888]">{formatReportDate(report.createdAt)} &mdash; {report.isPreview ? "Preview" : "Full Report"}</p></div>
                <ScoreBadge score={report.overallScore} grade={report.overallGrade} size="sm" />
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
