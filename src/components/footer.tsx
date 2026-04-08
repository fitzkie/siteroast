import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#2b2619] bg-[#090909] py-10">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[#8e8573]">
        <p>
          SiteRoast &mdash; AI-Powered Website Audits &mdash;{" "}
          <Link href="/pricing" className="underline decoration-[#6b5620] underline-offset-4 hover:text-[#f5c74d]">
            Pricing
          </Link>
        </p>
        <p className="mt-2 text-[#6f6758]">Powered by AI. Built for results.</p>
      </div>
    </footer>
  );
}
