"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScoreBadge } from "@/components/score-badge";

interface ReportSummary { id: string; url: string; overallScore: number; overallGrade: string; shareSlug: string; isPreview: boolean; createdAt: string; }

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
    return (<div className="min-h-screen bg-gray-950 text-white"><Nav /><div className="flex items-center justify-center pt-24"><p className="text-gray-400">Loading...</p></div></div>);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Reports</h1>
          <div className="flex gap-4">
            <Link href="/dashboard/billing" className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition">Manage Billing</Link>
            <Link href="/" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition">New Roast</Link>
          </div>
        </div>
        {reports.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-400 text-lg">No reports yet.</p>
            <Link href="/" className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition">Roast Your First Site</Link></div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link key={report.id} href={`/report/${report.shareSlug}`} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition">
                <div><p className="text-lg font-medium text-white">{report.url}</p>
                  <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString()} &mdash; {report.isPreview ? "Preview" : "Full Report"}</p></div>
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
