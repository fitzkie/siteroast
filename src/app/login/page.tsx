"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";

export default function LoginPage() {
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
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="mx-auto max-w-md px-6 pt-24">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-orange-500 focus:outline-none" required /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-orange-500 focus:outline-none" required /></div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition">
            {isLoading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="mt-6 text-center text-gray-400">Don&apos;t have an account? <Link href={`/signup${reportId ? `?reportId=${reportId}` : ""}`} className="text-orange-500 hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}
