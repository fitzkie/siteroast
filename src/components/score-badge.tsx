interface ScoreBadgeProps { score: number; grade: string; size?: "sm" | "lg"; }

export function ScoreBadge({ score, grade, size = "lg" }: ScoreBadgeProps) {
  const colorClass = score >= 90 ? "text-green-400 border-green-400" : score >= 70 ? "text-yellow-400 border-yellow-400" : score >= 50 ? "text-orange-400 border-orange-400" : "text-red-400 border-red-400";
  const dimensions = size === "lg" ? "h-32 w-32" : "h-20 w-20";
  const scoreSize = size === "lg" ? "text-4xl" : "text-2xl";
  const gradeSize = size === "lg" ? "text-lg" : "text-sm";
  return (
    <div className={`${dimensions} rounded-full border-4 ${colorClass} flex flex-col items-center justify-center`}>
      <span className={`${scoreSize} font-bold`}>{score}</span>
      <span className={`${gradeSize} font-medium opacity-75`}>{grade}</span>
    </div>
  );
}
