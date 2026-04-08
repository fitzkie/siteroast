"use client";

interface PricingCardProps { title: string; price: string; period: string; features: string[]; highlighted?: boolean; ctaText: string; onSelect: () => void; }

export function PricingCard({ title, price, period, features, highlighted = false, ctaText, onSelect }: PricingCardProps) {
  return (
    <div className={`rounded-[28px] border p-8 ${highlighted ? "border-[#5c4613] bg-[#171511] ring-1 ring-[rgba(228,182,59,0.24)] shadow-[0_24px_60px_rgba(0,0,0,0.28)]" : "border-[#2b2619] bg-[#141414]"}`}>
      {highlighted && <span className="mb-4 inline-block rounded-full border border-[#5c4613] bg-[#211a0f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c74d]">Most Popular</span>}
      <h3 className="text-xl font-semibold text-[#f5f1e8]">{title}</h3>
      <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold text-[#f5c74d]">{price}</span><span className="ml-2 text-[#8e8573]">{period}</span></div>
      <ul className="mt-6 space-y-3">
        {features.map((f, i) => (<li key={i} className="flex items-center text-[#d4cfc1]"><svg className="mr-3 h-5 w-5 text-[#e4b63b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>))}
      </ul>
      <button onClick={onSelect} className={`mt-8 w-full rounded-2xl py-3.5 font-semibold transition ${highlighted ? "bg-[#e4b63b] text-[#111111] hover:bg-[#f5c74d]" : "border border-[#40361f] bg-[#191919] text-[#f5f1e8] hover:border-[#5f4b19] hover:bg-[#1d1b16]"}`}>{ctaText}</button>
    </div>
  );
}
