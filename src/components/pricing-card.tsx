"use client";

interface PricingCardProps { title: string; price: string; period: string; features: string[]; highlighted?: boolean; ctaText: string; onSelect: () => void; }

export function PricingCard({ title, price, period, features, highlighted = false, ctaText, onSelect }: PricingCardProps) {
  return (
    <div className={`rounded-2xl border p-8 ${highlighted ? "border-orange-500 bg-gray-900 ring-2 ring-orange-500/20" : "border-gray-800 bg-gray-900"}`}>
      {highlighted && <span className="mb-4 inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">Most Popular</span>}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold text-white">{price}</span><span className="ml-2 text-gray-400">{period}</span></div>
      <ul className="mt-6 space-y-3">
        {features.map((f, i) => (<li key={i} className="flex items-center text-gray-300"><svg className="mr-3 h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>))}
      </ul>
      <button onClick={onSelect} className={`mt-8 w-full rounded-xl py-3 font-semibold transition ${highlighted ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-800 text-white hover:bg-gray-700"}`}>{ctaText}</button>
    </div>
  );
}
