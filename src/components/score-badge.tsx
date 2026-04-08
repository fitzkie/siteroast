interface ScoreBadgeProps { score: number; grade: string; size?: "sm" | "lg"; }

export function ScoreBadge({ score, grade, size = "lg" }: ScoreBadgeProps) {
  const dimensions = size === "lg" ? "h-32 w-32" : "h-20 w-20";
  const scoreSize = size === "lg" ? "text-4xl" : "text-2xl";
  const gradeSize = size === "lg" ? "text-lg" : "text-sm";
  return (
    <div className={`${dimensions} flex flex-col items-center justify-center rounded-full border-4 border-[#cfa638] bg-[radial-gradient(circle_at_top,rgba(228,182,59,0.22),rgba(18,18,18,0.98)_72%)] text-[#f5c74d] shadow-[0_0_0_1px_rgba(228,182,59,0.08),0_18px_40px_rgba(0,0,0,0.28)]`}>
      <span className={`${scoreSize} font-bold leading-none`}>{score}</span>
      <span className={`${gradeSize} mt-1 font-semibold text-[#f4e5bb]/80`}>{grade}</span>
    </div>
  );
}
