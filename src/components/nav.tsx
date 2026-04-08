"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Nav() {
  const { data: session } = useSession();
  return (
    <nav className="border-b border-[#2b2619] bg-[#090909]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-bold tracking-tight text-[#f5f1e8]">
          Site<span className="text-[#e4b63b]">Roast</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/pricing" className="text-sm font-medium text-[#b8b0a1] hover:text-[#f5f1e8]">
            Pricing
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-[#b8b0a1] hover:text-[#f5f1e8]">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-sm font-medium text-[#b8b0a1] hover:text-[#f5f1e8]">
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#4c3b13] bg-[#17140e] px-5 py-2.5 text-sm font-semibold text-[#f5c74d] shadow-[0_0_0_1px_rgba(228,182,59,0.08)] hover:border-[#e4b63b] hover:bg-[#211a0f] hover:text-[#fff4d4]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
