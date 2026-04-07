"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "portal" }) })
        .then((r) => r.json()).then((data) => { if (data.portalUrl) { window.location.href = data.portalUrl; } else { router.push("/pricing"); } });
    }
  }, [status, router]);
  return (<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p className="text-gray-400">Redirecting to billing portal...</p></div>);
}
