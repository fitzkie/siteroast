"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Nav() {
  const { data: session } = useSession();
  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-white">Site<span className="text-orange-500">Roast</span></Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
              <button onClick={() => signOut()} className="text-gray-400 hover:text-white transition">Sign Out</button>
            </>
          ) : (
            <Link href="/login" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
