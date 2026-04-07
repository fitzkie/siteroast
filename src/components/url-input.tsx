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
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-3">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter your website URL..."
        className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-6 py-4 text-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20" disabled={isLoading} />
      <button type="submit" disabled={isLoading || !url.trim()}
        className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {isLoading ? (<span className="flex items-center gap-2"><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Roasting...</span>) : "Roast My Site"}
      </button>
    </form>
  );
}
