"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsLoading(true); setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { setError("Invalid email or password"); setIsLoading(false); return; }
    if (reportId) {
      const unlockResponse = await fetch(`/api/roast/${reportId}/unlock`, { method: "POST" });
      const data = await unlockResponse.json();
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      if (data.unlocked) { router.push(`/report/${data.slug}`); return; }
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f1e8]">
      <Nav />
      <div className="mx-auto max-w-md px-6 pt-24">
        <div className="rounded-[32px] border border-[#2b2619] bg-[#141414] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <h1 className="mb-2 text-center text-3xl font-bold">Sign In</h1>
        <p className="mb-8 text-center text-sm text-[#9f9888]">Access your report history and unlock full audits.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="mb-1 block text-sm text-[#9f9888]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-[#3a311d] bg-[#1a1a1a] px-4 py-3 text-[#f5f1e8] focus:border-[#e4b63b] focus:outline-none focus:ring-4 focus:ring-[rgba(228,182,59,0.12)]" required /></div>
          <div><label className="mb-1 block text-sm text-[#9f9888]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-[#3a311d] bg-[#1a1a1a] px-4 py-3 text-[#f5f1e8] focus:border-[#e4b63b] focus:outline-none focus:ring-4 focus:ring-[rgba(228,182,59,0.12)]" required /></div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-[#e4b63b] py-3 font-semibold text-[#111111] hover:bg-[#f5c74d] disabled:opacity-50">
            {isLoading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="mt-6 text-center text-[#9f9888]">Don&apos;t have an account? <Link href={`/signup${reportId ? `?reportId=${reportId}` : ""}`} className="text-[#f5c74d] hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
