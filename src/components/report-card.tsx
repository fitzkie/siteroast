import { ScoreBadge } from "./score-badge";

interface Finding { text: string; severity: "critical" | "warning" | "nice-to-have"; }
interface ReportCardProps { title: string; score: number; grade: string; roast: string; findings: Finding[]; fixFirst: string; }

const severityColors = { critical: "bg-red-500/10 text-red-400 border-red-500/30", warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", "nice-to-have": "bg-blue-500/10 text-blue-400 border-blue-500/30" };
const severityLabels = { critical: "Critical", warning: "Warning", "nice-to-have": "Nice to Have" };

export function ReportCard({ title, score, grade, roast, findings, fixFirst }: ReportCardProps) {
  return (
    <div className="rounded-[28px] border border-[#2b2619] bg-[#141414] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#f5f1e8]">{title}</h3>
        <ScoreBadge score={score} grade={grade} size="sm" />
      </div>
      <p className="mb-6 italic text-[#d4cfc1]">&ldquo;{roast}&rdquo;</p>
      <div className="space-y-3 mb-6">
        {findings.map((finding, i) => (
          <div key={i} className={`rounded-lg border px-4 py-3 ${severityColors[finding.severity]}`}>
            <span className="text-xs font-medium uppercase opacity-75">{severityLabels[finding.severity]}</span>
            <p className="mt-1">{finding.text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#5f4b19] bg-[rgba(228,182,59,0.08)] px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#f5c74d]">Fix This First</span>
        <p className="mt-1 text-[#f3deb1]">{fixFirst}</p>
      </div>
    </div>
  );
}
