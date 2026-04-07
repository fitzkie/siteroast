import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-gray-500 text-sm">
        <p>SiteRoast &mdash; AI-Powered Website Audits &mdash; <Link href="/pricing" className="underline hover:text-gray-300">Pricing</Link></p>
        <p className="mt-2">Powered by AI. Built for results.</p>
      </div>
    </footer>
  );
}
