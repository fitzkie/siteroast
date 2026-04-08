"use client";
import { useState } from "react";

interface UrlInputProps { onSubmit: (url: string) => void; isLoading: boolean; }

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let normalizedUrl = url.trim();
    if (normalizedUrl && !normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    onSubmit(normalizedUrl);
  }
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter your website URL..."
        className="flex-1 rounded-2xl border border-[#3a311d] bg-[#141414] px-6 py-4 text-lg text-[#f5f1e8] placeholder-[#726a5d] shadow-[0_0_0_1px_rgba(228,182,59,0.02)] focus:border-[#e4b63b] focus:outline-none focus:ring-4 focus:ring-[rgba(228,182,59,0.12)]" disabled={isLoading} />
      <button type="submit" disabled={isLoading || !url.trim()}
        className="rounded-2xl bg-[#e4b63b] px-8 py-4 text-lg font-semibold text-[#111111] shadow-[0_14px_30px_rgba(228,182,59,0.16)] hover:bg-[#f5c74d] disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? (<span className="flex items-center gap-2"><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Roasting...</span>) : "Roast My Site"}
      </button>
    </form>
  );
}
